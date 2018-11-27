import React, {Component} from 'react';
import Slider from 'rc-slider';
const Range = Slider.createSliderWithTooltip(Slider.Range);
import 'rc-slider/assets/index.css';
import { WithContext as ReactTags } from 'react-tag-input';
import SearchStore from '../../stores/SearchStore'
import css from './react-tag-input.css';
import {observer} from 'mobx-react'
import {getPreSearchData, getTags, getSearchData} from "../../api";
import ProfileMin from "./ProfileMin";


const searchStore = new SearchStore();
const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

@observer
class SearchTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tags: [
            ],
            min_age: null,
            max_age: null,
            min_rate: null,
            max_rate: null,
            resp: null,
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }


    componentWillMount() {

        getTags().then(resp => {
            const data = resp.data;
            data.forEach((el, data)=> {
               el.id += '';
               el.text = el.tag;
            });
            searchStore.setTags(data);
            this.setState({tags:data});
            getPreSearchData().then(resp => {
                    const data = resp.data[0];
                    this.props.userStore.setUserAge(data.age);
                    this.props.userStore.setUserRate(data.rate);
                    // this.props.userStore.setUserLocation(data.location);
                    this.props.userStore.setUserSex(data.sex);
                    this.props.userStore.setUserOrientation(data.orientation);
                    const min_age = data.age - 7 < 18 ? 18 : parseInt(data.age) - 7;
                    const max_age = parseInt(data.age) + 7 > 100? 100 : parseInt(data.age) + 7;
                    const min_rate = data.rate - 10 < 0 ? 0 : parseInt(data.rate) - 10;
                    const max_rate = data.rate + 10 > 100 ? 100 : parseInt(data.rate) + 10;
                    searchStore.setMinAge(min_age);
                    searchStore.setMaxAge(max_age);
                    searchStore.setMinRate(min_rate);
                    searchStore.setMaxRate(max_rate);
                    this.setState({min_age,max_age},() => {
                        const location = data.location;
                        const tags = [];
                        const bt = this.state.tags;
                        this.props.userStore.setUserLocation(location);
                        bt.forEach((el, bt) => {
                            tags.push(el.tag);
                        });
                        searchStore.setTags(tags);
                        this.doSearch({
                            user_id : this.props.userStore.userID,
                            user_lat : location.x,
                            user_lon : location.y,
                            min_dist : 0,
                            max_dist : 30,
                            last_id: 0,
                            tags: searchStore.tags,
                            age_min : data.age - 7 < 18 ? 18 : parseInt(data.age) - 7,
                            age_max : parseInt(data.age) + 7 > 100? 100 : parseInt(data.age) + 7,
                            min_rate: min_rate,
                            max_rate: max_rate,
                            order_field : 'distance',
                            order : 'ASC',
                            orientation: data.orientation,
                            sex: data.sex
                        });
                    });

                }
            ).catch((reason) => {
            });
        }).catch((reason) => {
        });

    }
    doSearch = (params) => {
        getSearchData(params).then(resp => {
            const data = resp.data;
            this.setState({resp : data});
        }).catch((reason) => {
        });
    };
    customRail() {

    }

    handleDelete(i) {
        const { tags } = this.state;
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        },()=>{
            const tagState = this.state.tags;
            const tags = [];
            tagState.forEach((el, tagState) => {
                tags.push(el.text);
            });
            searchStore.setTags(tags);
            this.doSearch({
                user_id : this.props.userStore.userID,
                user_lat : this.props.userStore.location.x,
                user_lon : this.props.userStore.location.y,
                min_dist : searchStore.minDist,
                max_dist : searchStore.maxDist,
                tags: tags,
                last_id: searchStore.last_id,
                min_rate: searchStore.minRate,
                max_rate: searchStore.maxRate,
                age_min : searchStore.minAge,
                age_max : searchStore.maxAge,
                order_field : searchStore.sort,
                order : searchStore.order,
                orientation: this.props.userStore.orientation,
                sex: this.props.userStore.sex
            })
        });
    }

    handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }), ()=>{
            const tagState = this.state.tags;
            const tags = [];
            tagState.forEach((el, tagState) => {
                tags.push(el.text);
            });
            searchStore.setTags(tags);
            this.doSearch({
                user_id : this.props.userStore.userID,
                user_lat : this.props.userStore.location.x,
                user_lon : this.props.userStore.location.y,
                min_dist : searchStore.minDist,
                max_dist : searchStore.maxDist,
                tags: tags,
                last_id: searchStore.last_id,
                min_rate: searchStore.minRate,
                max_rate: searchStore.maxRate,
                age_min : searchStore.minAge,
                age_max : searchStore.maxAge,
                order_field : searchStore.sort,
                order : searchStore.order,
                orientation: this.props.userStore.orientation,
                sex: this.props.userStore.sex
            })
        });

    }

    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: newTags });
    }
    handleSelect = (e) => {
        e.preventDefault();
        searchStore.setSort(e.target.value);
        this.doSearch({
            user_id : this.props.userStore.userID,
            user_lat : this.props.userStore.location.x,
            user_lon : this.props.userStore.location.y,
            min_dist : searchStore.minDist,
            max_dist : searchStore.maxDist,
            tags: searchStore.tags,
            last_id: searchStore.last_id,
            min_rate: searchStore.minRate,
            max_rate: searchStore.maxRate,
            age_min : searchStore.minAge,
            age_max : searchStore.maxAge,
            order_field : e.target.value,
            order : searchStore.order,
            orientation: this.props.userStore.orientation,
            sex: this.props.userStore.sex
        })
    };
    handleOrder = (e) => {
        e.preventDefault();
        searchStore.setOrder(e.target.value);
        this.doSearch({
            user_id : this.props.userStore.userID,
            user_lat : this.props.userStore.location.x,
            user_lon : this.props.userStore.location.y,
            min_dist : searchStore.minDist,
            max_dist : searchStore.maxDist,
            tags: searchStore.tags,
            last_id: searchStore.last_id,
            min_rate: searchStore.minRate,
            max_rate: searchStore.maxRate,
            age_min : searchStore.minAge,
            age_max : searchStore.maxAge,
            order_field : searchStore.sort,
            order : e.target.value,
            orientation: this.props.userStore.orientation,
            sex: this.props.userStore.sex
        })
    };
    handleDist = (e) => {
        searchStore.setMinDist(e[0]);
        searchStore.setMaxDist(e[1]);
        this.doSearch({
            user_id : this.props.userStore.userID,
            user_lat : this.props.userStore.location.x,
            user_lon : this.props.userStore.location.y,
            min_dist : e[0],
            max_dist : e[1],
            tags: searchStore.tags,
            last_id: searchStore.last_id,
            min_rate: searchStore.minRate,
            max_rate: searchStore.maxRate,
            age_min : searchStore.minAge,
            age_max : searchStore.maxAge,
            order_field : searchStore.sort,
            order : searchStore.order,
            orientation: this.props.userStore.orientation,
            sex: this.props.userStore.sex
        })
     };
    handleAge = (e) => {
        searchStore.setMinAge(e[0]);
        searchStore.setMaxAge(e[1]);
        this.setState({min_age:e[0], max_age:e[1]});
        this.doSearch({
            user_id : this.props.userStore.userID,
            user_lat : this.props.userStore.location.x,
            user_lon : this.props.userStore.location.y,
            min_dist : searchStore.minDist,
            max_dist :searchStore.maxDist,
            tags: searchStore.tags,
            min_rate: searchStore.minRate,
            max_rate: searchStore.maxRate,
            age_min : e[0],
            age_max : e[1],
            last_id: searchStore.last_id,
            order_field : searchStore.sort,
            order : searchStore.order,
            orientation: this.props.userStore.orientation,
            sex: this.props.userStore.sex
        })
    };
    handleRate = (e) => {
        searchStore.setMinRate(e[0]);
        searchStore.setMaxRate(e[1]);
        this.setState({min_rate:e[0], max_rate:e[1]});
        this.doSearch({
            user_id : this.props.userStore.userID,
            user_lat : this.props.userStore.location.x,
            user_lon : this.props.userStore.location.y,
            min_dist : searchStore.minDist,
            max_dist :searchStore.maxDist,
            tags: searchStore.tags,
            min_rate: e[0],
            max_rate: e[1],
            last_id: searchStore.last_id,
            age_min : searchStore.minAge,
            age_max : searchStore.maxAge,
            order_field : searchStore.sort,
            order : searchStore.order,
            orientation: this.props.userStore.orientation,
            sex: this.props.userStore.sex
        })
    };
    displaySearch = () => {
        if (this.state.resp)
        {
            const profiles = this.state.resp.map((prof, index) => {
                let key = prof.id ? "prof" + prof.id : "prof"+index+"new";
                return <ProfileMin key={key.toString()} data={prof}/>
            });
            return profiles;
        }
        return null;
    };
    getSearchRef = (node) => {this._divEl = node};
    render() {
        const { tags, suggestions } = this.state;
        return (
            <div className="search-section row h-100 nopadding">
                <div className="search-content col-12 col-lg-auto">
                    <p className="fx-18 pt-5">Advanced search options</p>
                    <span className="fx-14">Sort by:</span>
                    <select className="search-selector ml-2" onChange={this.handleSelect}>
                        <option value={"distance"} name={"distance"}>distance</option>
                        <option value={"age"}>age</option>
                        <option value={"rate"}>popularity</option>
                        <option value={"num"}>tags</option>
                    </select>
                    <select className="search-selector" onChange={this.handleOrder}>
                        <option value={"ASC"}>ascending order</option>
                        <option value={"DESC"}>descending order</option>
                    </select>
                    <div className="pt-3">
                        <p className="fx-14 pt-5">Distance (km)</p>
                        <Range
                            min={0}
                            max={100}
                            defaultValue={[0, 30]}
                            marks={{ 0:"0", 100:"100+" }}
                            railStyle={{ "backgroundColor" : "#5f5f5f" }}
                            tipFormatter={value => `${value}km`}
                            onAfterChange = {value => this.handleDist(value)}
                        />

                        <p className="fx-14 pt-5">Age</p>
                        <Range
                            min={18}
                            max={100}
                            defaultValue={[searchStore.minAge, searchStore.maxAge]}
                            value={[searchStore.minAge, searchStore.maxAge]}
                            marks={{ 18: "18", 100: "100" }}
                            railStyle={{ "backgroundColor" : "#5f5f5f" }}
                            tipFormatter={value => `${value}`}
                            onChange={value => {searchStore.setMinAge(value[0]);searchStore.setMaxAge(value[1]);}}
                            onAfterChange = {value => this.handleAge(value)}
                        />
                        <p className="fx-14 pt-5">Popularity</p>
                        <Range
                            min={0}
                            max={100}
                            defaultValue={[searchStore.minRate, searchStore.maxRate]}
                            value={[searchStore.minRate, searchStore.maxRate]}
                            marks={{ 25: "25%", 50: "50%", 75: "75%" }}
                            railStyle={{ "backgroundColor" : "#5f5f5f" }}
                            tipFormatter={value => `${value}%`}
                            onChange={value => {searchStore.setMinRate(value[0]);searchStore.setMaxRate(value[1]);}}
                            onAfterChange = {value => this.handleRate(value)}
                        />
                    </div>
                    <div className="search-tags pt-5">
                        <p className="fx-14">Search by tags:</p>
                        <ReactTags tags={tags}
                                   suggestions={suggestions}
                                   handleDelete={this.handleDelete}
                                   handleAddition={this.handleAddition}
                                   handleDrag={this.handleDrag}
                                   delimiters={delimiters}
                                   maxLength={20}
                        />
                    </div>
                </div>
                <div className="search-list col-12 col-lg nopadding" ref={this.getSearchRef}>
                    {/* Один итем - один профиль в списке */}
                    {this.displaySearch()}
                    {/* Конец итема */}

                </div>
            </div>
        );
    }
}

export default SearchTab;