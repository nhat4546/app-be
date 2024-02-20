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
        const timeNow = moment();
        const timeWorkStart = timeNow <= timeAt8h ? timeAt8h : timeNow;

        const firstCheck = new CheckingInformationEntity();
        firstCheck.checkIn = timeNow.toDate();
        firstCheck.workStart = timeWorkStart.toDate();
        firstCheck.workEnd = timeWorkStart.add(9.5, 'hours').toDate();
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
