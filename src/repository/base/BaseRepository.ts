import mongoose, { FilterQuery } from 'mongoose'

export abstract class BaseRepository<T> {
  protected model: mongoose.Model<T & mongoose.Document>

  constructor(schemaModel: mongoose.Model<T & mongoose.Document>) {
    this.model = schemaModel
  }

  async findById(id: string) {
    return await this.model.findById(id).lean()
  }

  async findOne(obj: any, projection = {}) {
    return await this.model.findOne(obj, projection)
  }

  async find(obj?: any) {
    return await this.model.find(obj ?? {})
  }

  async create(item: Partial<T>) {
    await this.model.create(item)
  }

  async update(_id: string, item: Partial<T>, options?: Object) {
    await this.model.findByIdAndUpdate(_id, item, { useFindAndModify: false, ...options })
  }

  async findOneAndUpdate(filter: Partial<T>, item: Partial<T>, options?: Object) {
    return await this.model.findOneAndUpdate(filter as FilterQuery<T>, item, { useFindAndModify: false, ...options })
  }

  async delete(_id: string) {
    await this.model.findByIdAndDelete({ _id })
  }
}
