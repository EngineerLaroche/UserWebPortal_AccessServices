import React from 'react';
import {mount, shallow} from 'enzyme';
import {ListReferents} from 'components/referent/ListReferents';
import agent from 'agent';

describe('ListReferents is rendering', () => {
    let component;
    let data = {
        0: {
            CellPhone: "1-820-888-1111",
            Email: "referent@test.com",
            Fax: "123456789",
            Firstname: "Referent",
            Id: 1,
            Lastname: "Test",
            Title: "Avocat",
            WorkPhone: "454729692231"
        }
    };
    let handleChange = jest.fn();
    let searchReferents = jest.fn();

    beforeEach(() => {
        component = shallow(<ListReferents handleChange={handleChange}
                                           searchReferents={searchReferents}/>);
    });
    //
    it('Is mounting', () => {
        expect(component.setState({'referents': data}));
        expect(component.setState({'search': ''}));
        expect(component.find('input').props().value).toEqual(component.props().search);
        expect(component.find('li').length).toEqual(1);
        expect(component.find('li').props().key).toEqual(data.Email);
        expect(component).toMatchSnapshot();
    });
});

describe('ListReferent behaves', () => {
    let component;
    let data = {
        0: {
            CellPhone: "1-820-888-1111",
            Email: "referent@test.com",
            Fax: "123456789",
            Firstname: "Referent",
            Id: 1,
            Lastname: "Test",
            Title: "Avocat",
            WorkPhone: "454729692231"
        }
    };
    let handleChange = jest.fn();
    let searchReferents = jest.fn();

    beforeEach(() => {
        component = shallow(<ListReferents handleChange={handleChange}
                                           searchReferents={searchReferents}/>);
    });

    // On search
    it('OnSearch should be called properly', () => {
        const button = component.find('button').first();
        const searchInput = component.find('input').first();

        searchInput.simulate('change', {target: {value: 'ref'}, param : 'search'});
        expect(component.setState({[search] : 'ref'})).toHaveBeenCalledTimes(1);
        button.simulate('click');
        expect(searchReferents).toHaveBeenCalledTimes(1);
    });

    // On click on list item
    it('Click the list item links, should redirect rightfully', () => {
        component.setState({'referents': data});
        Object.values(data).map((d, i) => {
            let link = component.find('li').at(i).children().first();
            console.log(link.debug());
            expect(link.props().to)
                .toEqual('/referent/' + d.Email);
        });
    });
});