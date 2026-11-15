import {Identifiable} from "./basic-contracts";
import {Person} from "./person-hierarchy";

export abstract class Product implements Identifiable {
    constructor(
       public readonly id: string,
       public name: string,
       private _price: number
    ){
        this.price = _price;
    }

    get price(): number {
        return this._price;
    }

    set price(value: number) {
        if(value <= 0){
            throw new Error("Value must be greater than 0");
        }
        this._price = value;
    }

    get label(): string{
        return `${this.name} --- ${this._price}`;
    }

    abstract getDescription(): string;
}

export class Customer extends Person {
    private _purchase: number[] =[];

    constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        public readonly loyaltyCardNumber: string,
    ) {
        super(id, firstName, lastName, email);
    }

    public addPurchase(amount:number): void{
        if(amount <= 0){
            throw new Error("Value must be greater than 0");
        }
        this._purchase.push(amount);
    }

    public getPurchases(): readonly number[]{
        return this._purchase;
    };

    public calculateTotal(): number{
        return this._purchase.reduce((a, b) => a + b, 0);
    }

    public calculateAverage(): number {
        if(this._purchase.length === 0) return 0;
        const total = this._purchase.reduce((acc, curr) => acc + curr, 0);
        return Number((total / this._purchase.length).toFixed(2));
    }

    override getRoleDescription(): string {
        return `Customer (Card: ${this.loyaltyCardNumber}, Total: ${this.calculateTotal()})`;
    }
}

export class Order implements Identifiable {
    constructor(
        public readonly id: string,
        public description: string,
        public totalAmount: number,
        private _customer: Customer,
    ) {
    }

    get customer():Customer{
        return this._customer;
    }

    public reassignCustomer(newCustomer: Customer): void {
        console.log(`Order "${this.description}" now belongs to ${newCustomer.fullName}`);
        this._customer = newCustomer;
    }
}

export class LoyaltyClub implements Identifiable {
    private _customer: Map<string, Customer> = new Map();

    constructor(
        public readonly id: string,
        public name: string,
        public manager?: Person,
    ) {}

    public addCustomer(customer: Customer): void {
        if(this._customer.has(customer.id)) {
            throw new Error(`Customer ${customer.fullName} is already in group ${this.name}`);
        }
        this._customer.set(customer.id, customer);
    }

    public removeCustomer(customerId: string): boolean{
        return this._customer.delete(customerId);
    }

    public getCustomers(): Customer[]{
        return Array.from(this._customer.values());
    }

    public getAverageSpending(): number{
        const list = this.getCustomers();
        if(list.length === 0) return 0;
        const total = list.reduce((acc, curr) => acc + curr.calculateTotal(), 0);
        return Number((total / list.length).toFixed(2));
    }
}

export class Shop implements Identifiable {
    private _clubs: Map<string, LoyaltyClub> = new Map();

    constructor(
        public readonly id: string,
        public name: string,
    ) {}

    public createClub(id: string, name: string, manager?: Person): LoyaltyClub {
        if (this._clubs.has(id)) {
            throw new Error(`Club ${id} already exists in shop ${this.name}`);
        }
        const newClub = new LoyaltyClub(id, name, manager);
        this._clubs.set(id, newClub);
        return newClub;
    }

    public deleteClub(clubId: string): boolean {
        return this._clubs.delete(clubId);
    }

    public findClubById(clubId: string): LoyaltyClub | undefined {
        return this._clubs.get(clubId);
    }

    public getAllClubs(): LoyaltyClub[] {
        return Array.from(this._clubs.values());
    }
}
// Простыми словами: кэш это «шкафчик с быстрым доступом», куда временно кладут вещи, чтобы не искать их каждый раз заново. Как и репозиторий, он универсальный: в него можно класть что угодно, лишь бы у вещи была бирка с номером (id). Разница в том, что кэш работает мгновенно (без async) и умеет ещё две вещи: сказать, сколько в нём вещей, и полностью опустеть.
//
//     Технически, что нужно:
//
//     Интерфейс ICache<T extends Identifiable> с методами:
//     set(entity: T): void
//     get(id: string): T | undefined
// has(id: string): boolean
// remove(id: string): boolean
// size(): number
// clear(): void
//     Класс InMemoryCache<T extends Identifiable> implements ICache<T>:
// приватное поле _items: Map<string, T> = new Map();
// set: кладёт сущность в Map по её id;
// get: возвращает значение из Map (без ?? null, нам подходит undefined);
// has, remove берут готовые методы Map (has, delete);
// size: возвращает this._items.size (у Map это свойство, а не метод, скобок не нужно);
// clear: вызывает this._items.clear().
//
//     Подсказки:
//
// Сравни с InMemoryRepository: уберёшь async и Promise, а типы возврата станут обычными.
//     ICache и InMemoryCache экспортируй (export), как в repository.ts.


export interface ICache<T extends Identifiable> {
    set(entity: T): void;
    get(id: string): T | undefined;
    has(id: string): boolean;
    remove(id: string): boolean;
    size(): number;
    clear(): void;
}

export class InMemoryCache<T extends Identifiable> implements ICache<T> {
    private _items: Map<string, T> = new Map();

    set(entity: T): void {
        this._items.set(entity.id, entity);
    }

    get(id: string): T | undefined {
        return this._items.get(id);
    }

    has(id: string): boolean {
        return this._items.has(id);
    }

    remove(id: string): boolean {
        return this._items.delete(id);
    }

    size(): number {
        return this._items.size;
    }

    clear(): void {
        this._items.clear();
    }
}