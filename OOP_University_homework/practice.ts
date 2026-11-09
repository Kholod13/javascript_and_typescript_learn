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