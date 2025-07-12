export class UsermasterModel {
    id!: number;
    companyname!: string;
    email!: string;
    userType!: number;
    appversion!: string;
    roleid!: number;
    currentlogintime!: string;
    currentlogintimestr!: string;
    lastlogintime!: string;
    lastlogintimestr!: string;
    token!: string;
    refreshtoken!: string;
    refreshtokenexpirytime!: string;
    encryptionKey!: string;
    entrybyuserid!: number;
    displayname!: string;
    userName!: string;
    password!: string;
    newpassword!: string;
    role!: string;
    active!: boolean;
    nextloginchangepassword!: boolean;
    firstname!: string;
    designation!: string;
    middelname!: string;
    lastname!: string;
    name!: string;
    code!: string;
    mobileno!: string;
    city!: string;
    notes!: string;
    address!: string;

}


export class UserRefrence{
    referenceNo!:string;
} 
