import React from 'react';
import {mount, shallow} from 'enzyme';
import { PointServiceDetails } from 'components/pointService/PointServiceDetails';
import agent from 'agent';

describe('PointServiceDetails is rendering', () => {
    let component;

    beforeAll(() => {
        agent.Auth.login('yross@gucci.com','12345');
        agent.Auth.current();
        component = mount(<PointServiceDetails />)
    });

    beforeEach(() => {

    });

    afterEach(() => {

    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it('PointServiceDetails renders components', () => {
        expect(true).toEqual(true);
        expect(component.find('.row').length).toEqual(1);
    });
});
