import React from 'react';
import {mount, shallow} from 'enzyme';
import { CreateDemandeService } from 'components/demandeService/CreateDemandeService';
import agent from 'agent';

describe('CreateDemandeService is rendering', () => {
    let component;

    beforeAll(() => {
        agent.Auth.login('yross@gucci.com','12345');
        agent.Auth.current();
        component = shallow(<CreateDemandeService />)
    });

    afterAll(() => {
        agent.Auth.logout();
    });

    it('CreateDemandeService renders components', () => {
        expect(component.find('.row').length).toEqual(1);
        component.toMatchSnapshot();
    });
});
