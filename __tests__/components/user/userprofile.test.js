import React from 'react';
import {mount, shallow} from 'enzyme';
import { Profile } from 'components/user/Profile';
import agent from 'agent';

describe('Profile is rendering', () => {
    let component;

    beforeAll(() => {
        agent.Auth.login('yross@gucci.com','12345');
        agent.Auth.current();
        component = mount(<Profile />)
    });

    beforeEach(() => {

    });

    afterEach(() => {

    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it('Profile renders components', () => {
        expect(true).toEqual(true);
        expect(component.find('.row').length).toEqual(1);
    });
});
