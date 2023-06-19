import { IUserRepository } from '@/repository/user/IUserRepository';
import { UserRepository } from '@/repository/user/UserRepository';
import { Container } from 'typedi';

export const configureContainer = (): void => {
    Container.set<IUserRepository>(ServiceToken.userRepository, new UserRepository());
};

export const enum ServiceToken {
    userRepository = 'userRepository'
}