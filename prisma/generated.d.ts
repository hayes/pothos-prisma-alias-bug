/* eslint-disable */
import type { Prisma, Account, Value } from "./client";
export default interface PrismaTypes {
    Account: {
        Name: "Account";
        Shape: Account;
        Include: Prisma.AccountInclude;
        Select: Prisma.AccountSelect;
        OrderBy: Prisma.AccountOrderByWithRelationInput;
        WhereUnique: Prisma.AccountWhereUniqueInput;
        Where: Prisma.AccountWhereInput;
        Create: Prisma.AccountCreateInput;
        Update: Prisma.AccountUpdateInput;
        RelationName: "values";
        ListRelations: "values";
        Relations: {
            values: {
                Shape: Value[];
                Name: "Value";
            };
        };
    };
    Value: {
        Name: "Value";
        Shape: Value;
        Include: Prisma.ValueInclude;
        Select: Prisma.ValueSelect;
        OrderBy: Prisma.ValueOrderByWithRelationInput;
        WhereUnique: Prisma.ValueWhereUniqueInput;
        Where: Prisma.ValueWhereInput;
        Create: Prisma.ValueCreateInput;
        Update: Prisma.ValueUpdateInput;
        RelationName: "account";
        ListRelations: never;
        Relations: {
            account: {
                Shape: Account;
                Name: "Account";
            };
        };
    };
}