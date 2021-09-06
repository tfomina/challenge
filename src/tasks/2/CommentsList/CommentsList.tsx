import React, {useEffect, useReducer} from "react";
import getDataRequest from "../data/getDataRequest";
import Loader from "../Loader";
import {parseDate} from "../helper";

type Comment = {
    id: number;
    created: string;
    text: string;
    author: number;
    parent: null | number;
    likes: number;
};

type StructuredComment = Omit<Comment, "author"> & {
    author: Author;
    children?: StructuredComment[];
};

type Author = {
    id: number;
    name: string;
    avatar: string;
};

const ACTIONS = {
    LOADING: "LOADING",
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE",
};

type loadAction = {type: typeof ACTIONS.LOADING};

type LoadSuccessAction = {
    type: typeof ACTIONS.SUCCESS;
    payload: {structuredComments: StructuredComment[]};
};

type LoadErrorAction = {type: typeof ACTIONS.FAILURE; payload: {error: string}};

type Action = loadAction | LoadSuccessAction | LoadErrorAction;

type State = {
    structuredComments: StructuredComment[];
    loading: boolean;
    error: null | string;
};

const initialState: State = {
    structuredComments: [],
    loading: false,
    error: null,
};

const getStructuredComments = (comments: Comment[], authors: Author[]) => {
    const clonedComments: StructuredComment[] = comments.map((c) => {
        const author = authors.find((a: Author) => c.author === a.id);
        return {...c, author: {...author!}};
    });

    const structuredComments: StructuredComment[] = [];

    clonedComments.forEach((comment) => {
        if (!comment.parent) return structuredComments.push(comment);

        const parentIndex = clonedComments.findIndex(
            (el) => el.id === comment.parent,
        );
        if (!clonedComments[parentIndex].children) {
            return (clonedComments[parentIndex].children = [comment]);
        }
        clonedComments[parentIndex].children?.push(comment);
    });

    return structuredComments;
};

const loadDataReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ACTIONS.LOADING:
            return {
                ...state,
                loading: true,
                structuredComments: [],
                error: null,
            };
        case ACTIONS.SUCCESS:
            const {structuredComments} = (action as LoadSuccessAction).payload;

            return {
                ...state,
                loading: false,
                structuredComments,
                error: null,
            };
        case ACTIONS.FAILURE:
            const {error} = (action as LoadErrorAction).payload;
            return {
                ...state,
                loading: false,
                structuredComments: [],
                error,
            };
        default:
            return state;
    }
};

const CommentsList: React.FC = () => {
    const [state, dispatch] = useReducer(loadDataReducer, initialState);
    const {structuredComments, loading, error} = state;

    useEffect(() => {
        const loadData = async () => {
            dispatch({type: ACTIONS.LOADING});
            try {
                const response = await getDataRequest();
                const {comments, authors} = response;

                const structuredComments: StructuredComment[] =
                    getStructuredComments(comments, authors);

                dispatch({
                    type: ACTIONS.SUCCESS,
                    payload: {structuredComments},
                });
            } catch (error: any) {
                dispatch({
                    type: ACTIONS.FAILURE,
                    payload: {error: error.message},
                });
            }
        };
        loadData();
    }, []);

    return (
        <div>
            <h3>Комментарии</h3>
            {error && <div>{error}</div>}
            {loading ? <Loader /> : <Comments comments={structuredComments} />}
        </div>
    );
};

const Comments: React.FC<{comments: StructuredComment[]}> = ({comments}) => (
    <ul className="comments">
        {comments.map((comment) => (
            <li key={comment.id} className="comments__item">
                <div className="comment">
                    <div className="comment__image">
                        <div
                            className="image"
                            style={{
                                backgroundImage: `url(
                                        ${comment.author.avatar}
                                    )`,
                            }}
                        ></div>
                    </div>
                    <div className="comment__info">
                        <div className="comment__info__author">
                            {comment.author.name}
                        </div>
                        <div className="comment__info__date">
                            {parseDate(comment.created)}
                        </div>
                    </div>

                    <div className="comment__likes">{comment.likes}</div>
                    <div className="comment__text">{comment.text}</div>
                </div>
                {comment.children && <Comments comments={comment.children} />}
            </li>
        ))}
    </ul>
);

export default CommentsList;
