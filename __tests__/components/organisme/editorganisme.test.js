import React from 'react';
import {mount, shallow} from 'enzyme';
import {EditOrganisme, EditOrganismeForm} from 'components/organisme/EditOrganisme';
import agent from 'agent';

describe('EditOrganisme is rendering', () => {
    let component;
    let form;
    let currentOrganisme = {
        address: 1,
        email: "test@organisme.com",
        fax: "454789692231",
        id: 1,
        name: "Test Inc.",
        phone: "1-800-888-1111",
    };
    let onSubmitForm= jest.fn();


    beforeAll(() => {
        agent.Auth.login('yross@gucci.com', '12345');
        agent.Auth.current();
        form = shallow(<EditOrganismeForm
            currentOrganisme={currentOrganisme}
            onSubmitForm={onSubmitForm}/>);
        component = shallow(<EditOrganisme/>);
    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it('EditOrganisme renders components', () => {
        expect(component).toMatchSnapshot();
    });
});
