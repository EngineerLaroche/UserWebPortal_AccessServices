import React from 'react';
import {mount, shallow} from 'enzyme';
import { EditPointService } from 'components/pointService/EditPointService';
import agent from 'agent';

describe('EditPointService is rendering', () => {
    let component;

    beforeAll(() => {
        agent.Auth.login('yross@gucci.com','12345');
        agent.Auth.current();
        component = mount(<EditPointService />)
    });

    beforeEach(() => {

    });

    afterEach(() => {

    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it('EditPointService renders components', () => {
        expect(true).toEqual(true);
        expect(component.find('.row').length).toEqual(1);
    });
});
