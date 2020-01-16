import React from 'react';
import {mount, shallow} from 'enzyme';
import { Register } from 'components/user/Register';
import agent from 'agent';

describe('Register is rendering', () => {
    let component;

    beforeAll(() => {
        agent.Auth.login('yross@gucci.com','12345');
        agent.Auth.current();
        component = mount(<Register />)
    });

    beforeEach(() => {

    });

    afterEach(() => {

    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it('Register renders components', () => {
        expect(true).toEqual(true);
        expect(component.find('.row').length).toEqual(1);
    });
});
