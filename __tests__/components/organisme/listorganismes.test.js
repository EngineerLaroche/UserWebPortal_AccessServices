import React from 'react';
import { mount , shallow} from 'enzyme';
import { ListOrganismes } from 'components/organisme/ListOrganismes';
import agent from 'agent';

describe('ListOrganismes renders', () => {
    let listOrg;
    let data = {
        1 : {Id: 1, Name: "OrganismeTest", Address: 2, Email: "organisme@test.com", Phone: "18009999999"}
    };
    let onSearch = jest.fn();

    beforeEach(() => {
        listOrg = shallow(<ListOrganismes onSearch={onSearch} />);
    });
    //
    it('Is mounting', () => {
        expect(listOrg.setState({'organismes': data }));
        expect(listOrg.setState({'search': '' }));
        expect(listOrg.find('label').first()).toBeDefined();
        expect(listOrg.find('input').props().value).toEqual(listOrg.props().search);
        expect(listOrg.find('li').length).toEqual(1);
        expect(listOrg.find('li').props().key).toEqual(data.Email);
        expect(listOrg).toMatchSnapshot();
    });
});

describe('ListOrganismes behaves', () => {
    let listOrg;
    let data = {
        1 : { Id: 1, Name: "OrganismeTest", Address: 2, Email: "organisme@test.com", Phone: "18009999999" }
    };
    let onSearch = jest.fn();

    beforeAll(() => {
        agent.Auth.login('yross@gucci.com','12345');
        agent.Auth.current();
    });

    beforeEach(() => {
        listOrg = shallow(<ListOrganismes onSearch={onSearch} />);
    });

    // On search
    it('OnSearch should be called properly', () => {
        const button = listOrg.find('button').first();
        const searchInput = listOrg.find('input').first();

        searchInput.simulate('change', {target: {value: 'org'}});
        button.simulate('click');
        expect(onSearch).toHaveBeenCalledTimes(1);
    });

    // On click on list item
    it('Click the list item links, should redirect rightfully', () => {
        listOrg.setState({'organismes': data });
        Object.values(data).map((d, i) => {
            let link = listOrg.find('li').at(i).children().first();
            console.log(link.debug());
            expect(link.props().to)
                 .toEqual('/organisme/'+d.Email);
        });
    });
});
