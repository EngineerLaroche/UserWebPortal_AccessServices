import React from 'react';
import {mount, shallow} from 'enzyme';
import { ListPointServices } from 'components/pointService/ListPointServices';
import agent from 'agent';

describe('ListPointServices is rendering', () => {
    let component;

    beforeAll(() => {
        agent.Auth.login('yross@gucci.com','12345');
        agent.Auth.current();
        component = mount(<ListPointServices />)
    });

    beforeEach(() => {

    });

    afterEach(() => {

    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it('ListPointServices renders components', () => {
        expect(true).toEqual(true);
        expect(component.find('.row').length).toEqual(1);
    });
});
