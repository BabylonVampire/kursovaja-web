export class CreateTopicDto {
  readonly title: string;
  readonly description?: string;
  readonly subject: string;
  readonly course: number;
  readonly targetGroups: string[];
}
