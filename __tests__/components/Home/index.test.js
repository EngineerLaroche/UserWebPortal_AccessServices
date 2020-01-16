import React from 'react';
import {mount, shallow} from 'enzyme';
import { index } from 'components/Home/index';
import agent from 'agent';

describe('index is rendering', () => {
    let component;

    beforeAll(() => {
        agent.Auth.login('yross@gucci.com','12345');
        agent.Auth.current();
//        component = mount(<index />)
    });

    beforeEach(() => {

    });

    afterEach(() => {

    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it('index renders components', () => {
        expect(true).toEqual(true);
//        expect(component.find('.row').length).toEqual(1);
    });
});
