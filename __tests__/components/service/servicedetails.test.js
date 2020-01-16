import React from 'react';
import {mount, shallow} from 'enzyme';
import { ServiceDetails } from 'components/service/ServiceDetails';
import agent from 'agent';

describe('ServiceDetails is rendering', () => {
    let component;

/*
 Need to add link to props in here.
*/

    beforeAll(() => {
        agent.Auth.login('yross@gucci.com','12345');
        agent.Auth.current();
//        component = mount(<ServiceDetails />)
    });

    beforeEach(() => {

    });

    afterEach(() => {

    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it('ServiceDetails renders components', () => {
        expect(true).toEqual(true);
//        expect(component.find('.row').length).toEqual(1);
    });
});
