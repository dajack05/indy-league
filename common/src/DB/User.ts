export enum UserClass {
	USER = 0,
	ADMIN = 1,
	COUNT = 2,
};

export class User {
	id!: number;
	first_name!: string;
	last_name!: string;
	email!: string;
	password!: string;

	class!: UserClass;
};