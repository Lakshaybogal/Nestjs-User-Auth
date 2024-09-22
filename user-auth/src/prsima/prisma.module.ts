// src/prisma/prisma.module.ts

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // Global module allows PrismaService to be used anywhere without import
@Module({
    providers: [PrismaService],
    exports: [PrismaService],  // Export PrismaService so it can be used in other modules
})
export class PrismaModule { }
