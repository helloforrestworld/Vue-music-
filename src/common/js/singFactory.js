export class SingFactory {
  constructor({name, id}) {
    this.name = name;
    this.id = id;
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`;
  }
};