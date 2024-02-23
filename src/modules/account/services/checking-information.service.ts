import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Between, Repository } from 'typeorm';
import { CheckingInformationEntity } from '../entities/checking-information.entity';

@Injectable()
export class CheckingInformationService {
  constructor(
    @InjectRepository(CheckingInformationEntity)
    private checkingInformationRepository: Repository<CheckingInformationEntity>,
  ) {}

  async updateCheckingCheckout(id: number) {
    try {
      const currentDateStart = moment().startOf('day').toDate();
      const currentDateEnd = moment().endOf('day').toDate();

      const info = await this.checkingInformationRepository.findOne({
        where: {
          accountId: id,
          checkIn: Between(currentDateStart, currentDateEnd),
        },
      });

      if (!info) {
        const timeAt8h = moment().set({ hour: 8, minute: 0, second: 0 });
        const timeAt18h30 = moment().set({ hour: 18, minute: 30, second: 0 });
        const timeNow = moment();

        let timeWorkStart: moment.Moment | null;
        if (timeNow <= timeAt8h) {
          timeWorkStart = timeAt8h;
        } else if (timeNow <= timeAt18h30) {
          timeWorkStart = timeNow;
        } else {
          timeWorkStart = null;
        }

        let timeWorkEnd: moment.Moment | null;
        if (timeWorkStart) {
          timeWorkEnd = timeWorkStart.add(9.5, 'hours');
          if (timeAt18h30 < timeWorkEnd) {
            timeWorkEnd = timeAt18h30;
          }
        }

        const firstCheck = new CheckingInformationEntity();
        firstCheck.checkIn = timeNow.toDate();
        firstCheck.workStart = timeWorkStart?.toDate();
        firstCheck.workEnd = timeWorkEnd?.toDate();
        firstCheck.accountId = id;

        return await this.checkingInformationRepository.save(firstCheck);
      }

      info.checkOut = moment().toDate();

      await this.checkingInformationRepository.save(info);
    } catch (error) {
      console.log('UPDATE_CHECKING_INFORMATION_FAIL', error);
      throw new BadRequestException(error);
    }
  }
}
