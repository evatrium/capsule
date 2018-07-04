import React from 'react';
import {Loading} from "../../components/Loading";
import {DetailCapsule} from "./detailCapsule";
import {Btn} from "../../components/Btn";

@DetailCapsule
export default class DetailView extends React.Component {

    constructor() {
        super();
        this.state = {
            item: {
                title: '',
                id: '',
                completed: false
            }
        };
    }

    componentDidMount() {
        console.log('detail view mounted')
        const {logic: {getTodo}} = this.props;
        getTodo((item) => {
            this.setState({...this.state, item});
        });
    }

    updateField = (e, field) => {
        let val = e.target.value;
  
        this.setState({item: {...this.state.item, [field]: val}}, () => {

        });
    };


    save = () => {
        const {logic: {saveTodo}} = this.props;

        saveTodo(this.state.item);
    };

    destroyIt = ()=>{
        const {logic: {destroyTodo}} = this.props;
        destroyTodo(this.state.item);
    };

    render() {

        const {classes, fetching} = this.props;
        const {item} = this.state;

        return (
            <div className={classes.root}>

                <div>
                    <h1>Detail View</h1>
                </div>

                <div style={{height: 300}}>
                    {fetching && <Loading/>}
                </div>

                <div style={{height: 300}}>

                    {!fetching &&

                    <div className={classes.todo}>
                        {!fetching &&
                        <div>

                            <div>
                                Title:
                            </div>
                            <div>
                                <input value={item.title} onChange={(e) => this.updateField(e, 'title')}/>
                            </div>

                            <div>
                                Completed:
                                <div
                                    onClick={() => this.setState({
                                        item: {
                                            ...this.state.item,
                                            completed: !this.state.item.completed
                                        }
                                    })}
                                    style={{
                                        border: '2px solid white',
                                        background: item.completed ? 'white' : 'transparent',
                                        borderRadius: '50%',
                                        height: 20,
                                        width: 20
                                    }}>
                                </div>
                            </div>

                            <Btn  onClick={this.save}>
                                Save
                            </Btn>


                            <Btn  onClick={this.destroyIt}>
                               Delete
                            </Btn>

                    


                        </div>

                        }
                    </div>

                    }

                </div>


            </div>
        );
    }
}


