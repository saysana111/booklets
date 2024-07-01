import { PartialType } from "@nestjs/mapped-types";
import {  CreateBookOrderDto } from "./create-bookorder.dto";

export class UpdateBookOrderDto extends PartialType(CreateBookOrderDto){}