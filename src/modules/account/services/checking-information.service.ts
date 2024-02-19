import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckingInformationEntity } from '../entities/checking-information.entity';

@Injectable()
export class CheckingInformationService {
  constructor(
    @InjectRepository(CheckingInformationEntity)
    private checkingInformationRepository: Repository<CheckingInformationEntity>,
  ) {}

  async updateCheckingCheckout(id: number) {
    try {
      const info = await this.checkingInformationRepository.findOne({
        where: { id },
      });

      if (!info) {
        const firstCheck = new CheckingInformationEntity();

        const currentDate = new Date();
        currentDate.setHours(8, 0, 0, 0);
        const timeAt8h = currentDate.getTime() / 1000;
        const timeCheckIn = new Date().getTime() / 1000;

        firstCheck.checkIn =
          timeCheckIn <= timeAt8h ? new Date(timeAt8h) : new Date();
        firstCheck.workStart = firstCheck.checkIn;
        firstCheck.workEnd = new Date(timeCheckIn * 9.5 * 60);

        return await this.checkingInformationRepository.save(firstCheck);
      }

      // if not check in mean fist check in
      // else check in from twice last check in = check out
      info.checkOut = new Date();

      // check first check in if before 8h => check in = 8h
      // const currentDate = new Date();
      // currentDate.setHours(8, 0, 0, 0);
      // const timeAt8h = currentDate.getTime() / 1000;
      // const checkInTime = information.checkIn.getTime() / 1000;
      // if (checkInTime <= timeAt8h) {
      //   information.checkIn = currentDate;
      // }

      await this.checkingInformationRepository.save(info);
    } catch (error) {
      console.log('UPDATE_CHECKING_INFORMATION_FAIL', error);
      throw new BadRequestException(error);
    }
  }
}
