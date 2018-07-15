import React from 'react';

import {ListViewCapsule} from "./listViewCapsule";
import {Loading} from "../../components/Loading";
import {Nested} from "./Nested";

@ListViewCapsule
export default class ListView extends React.Component {


    componentDidMount() {
        console.log('listview mounted. ... props',this.props);
        const {getTodos} = this.props;
        getTodos();
    }

    navigate = (id) => {
        const {editTodo} = this.props;
        editTodo(id);
    };


    render() {

        const {classes, todos,fetching, cx} = this.props;

        return (
            <div className={classes.root}>

                <div>
                    <h1>TODOS</h1>
                </div>
                <div>

                        <Nested/>
                </div>

                <div>
                    {fetching && <Loading/>}
                </div>
                <div>

                    {todos && todos.length > 0 && !fetching && todos.map((t) => (

                        <div className={cx(classes.todo)} key={t.id}
                             onClick={()=>this.navigate(t.id)}>
                            <div className={classes.title}>
                                Title: {" "} {t.title}
                            </div>
                            <div style={{marginTop: 10}}>
                                Completed: {" "} {t.completed ? <span>true</span>: <span>false</span>}
                            </div>
                        </div>

                    ))

                    }

                </div>


            </div>
        );
    }
}


