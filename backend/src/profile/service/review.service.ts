import { Injectable } from "@nestjs/common";
import { CrudService } from "src/model/crud-service";
import { Review } from "../entities/review.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { Profile } from "../entities/profile.entity";

@Injectable()
export class ReviewService extends CrudService<Review> {
  constructor(
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>
  ) {
    super(reviewRepo, "REVIEW_NOT_FOUND");
  }

  async updateTargetRating(targetProfileId: string) {
    const result = await this.reviewRepo.
      query(
        `SELECT SUM("skillRating") AS skillRating, 
        SUM("collaborativeRating") AS collaborativeRating, 
        SUM("communicativeRating") AS communicativeRating,
        COUNT(*) AS count
        FROM review WHERE review."targetId" = $1;
        `, [targetProfileId]
      );
    const { collaborativerating, skillrating, communicativerating, count } = result[0];
    const ratingCount = Number(count) === 0 ? 1 : Number(count);
    const avgCom = Number(communicativerating) / ratingCount;
    const avgSkill = Number(skillrating) / ratingCount;
    const avgCol = Number(collaborativerating) / ratingCount;
    const overall = (avgCom + avgSkill + avgCol) / 3;
    const ratings = {
      collaborativeRating: avgCol,
      skillRating: avgSkill,
      communicativeRating: avgCom,
      overallRating: overall,
      reviewCount: Number(count)
    };
    await this.profileRepo.update({ id: targetProfileId }, ratings);
  }


  async update(where: FindOptionsWhere<Review>, model: DeepPartial<Review>) {
    const entity = await this.getOne(where, { target: true });
    Object.assign(entity, model);
    const saved = await this.repo.save(entity);
    this.updateTargetRating(entity.target.id);
    return saved;

  }

  async create(model: DeepPartial<Review>) {
    const saved = await this.repo.save(model);
    this.updateTargetRating(model.target.id);
    return saved;
  }

  async remove(where: FindOptionsWhere<Review>) {
    const entities = await this.repo.find({ where, relations: { target: true } });
    const removed = await this.repo.remove(entities);
    const targetIdSet: Set<string> = new Set();
    entities.forEach((ent) => targetIdSet.add(ent.target.id));
    for (const id of targetIdSet) {
      this.updateTargetRating(id);
    }
    return removed;
  }
}
