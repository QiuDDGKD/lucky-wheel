export interface IPrize {
  id: string; // 奖品 ID
  range: number;  // 权重
  name: string; // 奖品名称
  number: number; // 奖品数量
  hide?: boolean; // 是否隐藏
}

export interface IWheelConfig {
  size: number; // 转盘尺寸
  prizes: IPrize[]; // 奖品列表
  reduce: boolean; // 是否减少奖品数量
  onlyMiddle?: boolean; // 是否只会停在正中间
  rollDelay?: number; // 滚动延迟
  autoStop?: boolean; // 是否自动停止
  autoStopDelay?: number; // 自动停止延迟
  showWheelName?: boolean; // 是否显示转盘名称
  showPrizeName?: boolean; // 是否显示奖品名称
  verticalPrizeName?: boolean; // 是否垂直显示奖品名称
  fontSize?: number; // 字体大小
}

export interface IWheel {
  key: string; // 转盘唯一标识
  name: string; // 转盘名称
  editing: boolean; // 是否编辑中
}
