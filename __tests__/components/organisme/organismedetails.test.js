import React from 'react';
import {mount, shallow} from 'enzyme';
import { OrganismeDetails } from 'components/organisme/OrganismeDetails';
import agent from 'agent';

describe('OrganismeDetails is rendering', () => {
    let component;

    beforeAll(() => {
        agent.Auth.login('yross@gucci.com','12345');
        agent.Auth.current();
        component = mount(<OrganismeDetails />)
    });

    beforeEach(() => {

    });

    afterEach(() => {

    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it('OrganismeDetails renders components', () => {
        expect(true).toEqual(true);
        expect(component.find('.row').length).toEqual(1);
    });
});
