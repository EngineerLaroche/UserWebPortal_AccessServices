import React from 'react';
import {mount, shallow} from 'enzyme';
import { EditReferent } from 'components/referent/EditReferent';
import agent from 'agent';

describe('EditReferent is rendering', () => {
    let component;

    beforeAll(() => {
        agent.Auth.login('yross@gucci.com','12345');
        agent.Auth.current();
        component = mount(<EditReferent />)
    });

    beforeEach(() => {

    });

    afterEach(() => {

    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it('EditReferent renders components', () => {
        expect(true).toEqual(true);
        expect(component.find('.row').length).toEqual(1);
    });
});
