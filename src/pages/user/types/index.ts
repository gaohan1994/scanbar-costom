export declare namespace IUserStore {
  interface UserCoupon {}

  interface IUserState {
    couponList: UserCoupon[];
  }

  interface CardDetail {
    enableMemberPrice: boolean;
    identified: boolean;
    avatar: string;
    cardNo: string;
    createTime: string;
    levelName: string;
    merchantName: string;
    phoneNumber: string;
    sex: string;
    updateTime: string;
    couponNum: number;
    accumulativeMoney: number;
    accumulativePoints: number;
    id: number;
    levelId: number;
    memberDiscount: number;
    merchantId: number;
    overage: number;
    points: number;
    status: number;
    totalAmount: number;
    totalTimes: number;
    obtainMoney: number;
    obtainPoints: number;
  }

  interface IUserCardState {
    cardDetail: CardDetail;
  }
}
