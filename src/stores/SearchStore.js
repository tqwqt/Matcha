import {observable, action} from 'mobx'

class  SearchStore  {

    @observable minAge = 18;
    @observable maxAge = 100;
    @observable minDist = 0;
    @observable maxDist = 30;
    @observable minRate = 50;
    @observable maxRate = 100;
    @observable sort = 'distance';
    @observable order = 'ASC';
    @observable tags;
    @observable last_id = 0;

    constructor(){

    }
    setMinAge = (age) => {
      this.minAge = age;
    };
    setMaxAge = (age) => {
        this.maxAge = age;
    };
    setMinDist = (dist) => {
        this.minDist = dist;
    };
    setMaxDist = (dist) => {
        this.maxDist = dist;
    };
    setMinRate = (rate) => {
        this.minRate = rate;
    };
    setMaxRate = (rate) => {
        this.maxRate = rate;
    };
    setTags = (values) => {
        this.tags = values;
    };
    setSort = (value) => {
      this.sort = value;
    };
    setOrder = (value) => {
        this.order = value;
    };
    setLastId = (id) => {

      this.last_id = id;
    };

}

export default SearchStore;