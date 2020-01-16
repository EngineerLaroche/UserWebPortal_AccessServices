import React from 'react';
import {mount, shallow} from 'enzyme';
import { CreatePointService } from 'components/pointService/CreatePointService';
import agent from 'agent';

describe('CreatePointService is rendering', () => {
    let component;

    beforeAll(() => {
        agent.Auth.login('yross@gucci.com','12345');
        agent.Auth.current();
        component = mount(<CreatePointService />)
    });

    beforeEach(() => {

    });

    afterEach(() => {

    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it('CreatePointService renders components', () => {
        expect(true).toEqual(true);
        expect(component.find('.row').length).toEqual(1);
    });
});
