import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import { Role } from "src/auth/decorators/role.decorator";
import { ProfileService } from "../profile.service";
import { CurrentAccount } from "src/auth/decorators/account.decorator";
import { Account } from "src/account/entities/account.entity";
import { isUUID } from "class-validator";
import { generateException } from "src/exception/exception";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Review } from "../entities/review.entity";
import { ReviewService } from "../service/review.service";
import { ResGetallReview } from "../dto/res-getall-review.dto";
import { ReqAddReview } from "../dto/req-add-review.dto";
import { ReqGetallReview } from "../dto/req-getall-review.dto";
import { ReqUpdateReview } from "../dto/req-update-review.dto";

@ApiTags("Review")
@Controller("review")
export class ReviewController {
  constructor(private reviewService: ReviewService, private profileService: ProfileService) { }

  @ApiResponse({
    type: ResGetallReview
  })
  @ApiBody({
    type: ReqGetallReview,
  })
  @Role("public")
  @Get()
  async queryReview(@Body() ReqGetallReview: ReqGetallReview) {
    const { targetId, authorId, reviewTitle, reviewText,
      collaborativeRating, skillRating, communicativeRating,
      take, page } = ReqGetallReview;

    const reviews = await this.reviewService.getAll(page, take, {
      where: {
        target: { id: targetId },
        author: { id: authorId },
        reviewTitle,
        reviewText,
        collaborativeRating,
        skillRating,
        communicativeRating,
      },
      relations: {
        author: true,
        target: true,
      }
    });
    return reviews;
  }

  @ApiResponse({
    type: Review,
  })
  @ApiBody({
    type: ReqAddReview,
  })
  @Role("account")
  @Post()
  async addReview(@Body() reqAddReview: ReqAddReview, @CurrentAccount() account: Account) {
    const { targetProfileId, reviewTitle, reviewText, collaborativeRating, skillRating, communicativeRating } = reqAddReview;
    const profile = await this.profileService.getOne({ account: { id: account.id } });
    if (targetProfileId === profile.id) throw new BadRequestException(generateException("CANNOT_REVIEW_ITSELF"));
    const existingReview = await this.reviewService.getAll(1, 1, { where: { target: { id: targetProfileId }, author: {id: profile.id} } });
    if (existingReview.total !== 0) throw new BadRequestException(generateException("CANNOT_REVIEW_TWICE"));
    const targetProfile = await this.profileService.getOne({ id: targetProfileId });
    const review = await this.reviewService.create({ communicativeRating, skillRating, collaborativeRating, reviewText, reviewTitle, target: targetProfile, author: profile });
    return this.reviewService.getOne({ id: review.id });
  }

  @ApiResponse({
    type: Review,
  })
  @ApiBody({
    type: ReqUpdateReview,
  })
  @Role("account")
  @Patch()
  async updateReview(@Body() reqUpdateReview: ReqUpdateReview, @CurrentAccount() account: Account) {
    const profile = await this.profileService.getOne({ account: { id: account.id } });
    const { id, ...model } = reqUpdateReview;
    const updated = await this.reviewService.update({ id, author: { id: profile.id } }, model);
    return await this.reviewService.getOne({ id: updated.id });
  }

  @ApiResponse({
    type: Review,
  })
  @ApiParam({
    name: "id",
    format: "UUID",
  })
  @Role("account")
  @Delete(":id")
  async deleteReview(@Param("id") id: string, @CurrentAccount() account: Account) {
    const control = isUUID(id);
    if (!control) throw new NotFoundException(generateException("REVIEW_NOT_FOUND"));
    const profile = await this.profileService.getOne({ account: { id: account.id } });
    const review = await this.reviewService.getOne({ author: { id: profile.id }, id });
    await this.reviewService.remove({ id: review.id });
    return review;
  }
}
