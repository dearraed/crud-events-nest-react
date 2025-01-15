import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class EventDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsDate()
  @Type(() => Date) // Automatically transform string to Date
  date: Date;

  @IsNotEmpty()
  category: string;

  id: number;
}
