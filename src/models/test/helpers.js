/* External dependencies */
import moment from 'moment';

export const getIdForToday = () => {
    const dateElements = moment().format('YYMMDD');
    const idAsString = `101${dateElements}0001`;
    return +idAsString;
};

export const validUser = {
    id: 1,
    username: 'mike',
    fullName: 'Mike Tester',
    phone: '1234567890',
    email: 'mike@stuff.com',
    role: 'admin',
    password: 'thisisthepassword',
    passwordConfirmation: 'thisisthepassword',
};

export const validLead = {
    leadName: 'John Test',
    contactName: '',
    source: 'Facebook',
    leadFee: 0,
    phone: '1234567890',
    email: 'john@test.com',
    address: '123 Fake Street',
    lat: 0,
    lng: 0,
    description: 'This is a test lead',
    status: 'Active',
    assignTo: '',
    createdBy: 1,
    updatedBy: 1,
};

export const validChange = {
    parentId: 0,
    changeType: 'add',
    iconName: 'circle_add',
    title: 'Title of Change',
    details: 'This is a change for testing.',
    createdBy: 1,
    updatedBy: 1,
};

export const validMessage = {
    parentId: 0,
    messageType: 'text',
    recipient: process.env.MY_PHONE_NUMBER,
    subject: 'Subject for Test',
    body: 'This is a message for testing.',
    createdBy: 1,
    updatedBy: 1,
};