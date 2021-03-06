import * as React from 'react';
import {
    LikeNotification, FollowNotification, ParticipateNotification,
    CommentNotification, OthersRequest, User
} from '../../global/models';
import { requestUnreadOthersRequests } from '../../netAccess/requests';
import { requestUnreadComments } from '../../netAccess/comments';
import { requestUnreadFollows } from '../../netAccess/follows';
import { requestUnreadLikes } from '../../netAccess/likes';
import { requestParticipateResults, requestParticipateRequests } from '../../netAccess/participates';
import { RequestPage } from './RequestPage';
import { FollowPage } from './FollowPage';
import { LikePage } from './LikePage';
import { ParticipatePage } from './ParticipatePage';
import { CommentPage } from './CommentPage';
import './MessagePane.css';
import { ParticipateRequestPage } from './ParticipateRequestPage';

export type StateProps = {
    currentUser: User
};

type Props = StateProps;

const pages = ['约拍请求', '关注', '喜欢', '评论', '我的参与', '参与者申请'];

type State = {
    likes: LikeNotification[],
    follows: FollowNotification[],
    participateResults: ParticipateNotification[],
    participateRequests: ParticipateNotification[],
    comments: CommentNotification[],
    requests: OthersRequest[],
    selectedPage: '约拍请求' | '关注' | '喜欢' | '评论' | '我的参与' | '参与者申请'
};

export class MessagePaneComponent extends React.Component<Props, State> {

    state: State = {
        likes: [],
        comments: [],
        follows: [],
        participateResults: [],
        participateRequests: [],
        requests: [],
        selectedPage: '约拍请求'
    };

    componentDidMount() {
        const { userId } = this.props.currentUser;
        requestUnreadOthersRequests(userId).then(requests => this.setState({ requests }));
        requestUnreadComments(userId).then(comments => this.setState({ comments }));
        requestUnreadFollows(userId).then(follows => this.setState({ follows }));
        requestUnreadLikes(userId).then(likes => this.setState({ likes }));
        requestParticipateResults(userId).then(participateResults => this.setState({ participateResults }));
        requestParticipateRequests(userId).then(participateRequests => this.setState({ participateRequests }));
    }

    render() {
        const { comments, follows, likes, participateResults,
            requests, selectedPage, participateRequests } = this.state;
        const { currentUser } = this.props;
        let pageComponent;
        switch (selectedPage) {
            case '约拍请求':
                pageComponent = (
                    <RequestPage
                        currentUserName={currentUser.userName}
                        onChange={(newRequests: OthersRequest[]) => this.setState({ requests: newRequests })}
                        requests={requests}
                    />);
                break;
            case '关注':
                pageComponent = (
                    <FollowPage
                        currentUserId={currentUser.userId}
                        follows={follows}
                        onChange={(newFollows: FollowNotification[]) => this.setState({ follows: newFollows })}
                    />);
                break;
            case '喜欢':
                pageComponent = (
                    <LikePage
                        likes={likes}
                        onChange={(newLikes: LikeNotification[]) => this.setState({ likes: newLikes })}
                    />);
                break;
            case '评论':
                pageComponent = (
                    <CommentPage
                        comments={comments}
                        onChange={(newComments: CommentNotification[]) => this.setState({ comments: newComments })}
                    />);
                break;
            case '我的参与':
                pageComponent = (
                    <ParticipatePage
                        currentUserId={currentUser.userId}
                        onChange={(newResults: ParticipateNotification[]) =>
                            this.setState({ participateResults: newResults })}
                        results={participateResults}
                    />);
                break;
            case '参与者申请':
                pageComponent = (
                    <ParticipateRequestPage
                        requests={participateRequests}
                        onChange={(newRequests: ParticipateNotification[]) =>
                            this.setState({ participateRequests: newRequests })}
                    />
                );
                break;
            default:
                pageComponent = null;
        }

        return (
            <section>
                <nav className="horizontal-container centered">
                    {pages.map(page =>
                        <a
                            key={page}
                            onClick={() => this.setState({ selectedPage: page as any })}
                        >{page}
                        </a>)}
                </nav>
                {pageComponent}
            </section>
        );
    }
}
