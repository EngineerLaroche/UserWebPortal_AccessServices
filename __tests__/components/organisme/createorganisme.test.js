import React from 'react';
import {mount, shallow} from 'enzyme';
import { CreateOrganisme } from 'components/organisme/CreateOrganisme';
import agent from 'agent';

describe('CreateOrganisme is rendering', () => {
    let component;

    beforeAll(() => {
        agent.Auth.login('yross@gucci.com','12345');
        agent.Auth.current();
        component = mount(<CreateOrganisme />)
    });

    beforeEach(() => {

    });

    afterEach(() => {

    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it('CreateOrganisme renders components', () => {
        expect(true).toEqual(true);
        expect(component.find('.row').length).toEqual(1);
    });
});
