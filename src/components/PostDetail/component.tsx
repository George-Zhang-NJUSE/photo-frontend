import * as React from 'react';
import { ChangeEvent } from 'react';
// import { Link } from 'react-router-dom';
import { Post } from '../../global/models';
import UserBrief from '../UserBrief/UserBrief';
import Dialog from '../Models/Dialog';
import { addNewRequest, checkHasRequested } from '../../netAccess/request';
import { closePost } from '../../netAccess/posts';

export type DispatchProps = {
    setCurrentPostClosed: () => void,
    addRequestOnCurrentPost: () => void
};

export type StateProps = {
    currentUserId: number,
    post: Post
};

type PostDetailComponentProps = StateProps & DispatchProps;

export class PostDetailComponent extends React.Component<PostDetailComponentProps, {
    showDialog: boolean,
    message: string,
    hasRequested: boolean
}> {

    constructor(props: PostDetailComponentProps) {
        super(props);
        this.state = {
            showDialog: false,
            hasRequested: false,
            message: ''
        };
    }

    componentDidMount() {
        const { currentUserId } = this.props;
        const { postId } = this.props.post;
        checkHasRequested(currentUserId, postId).then(hasRequested => {
            this.setState({ hasRequested });
        });
    }

    showRequestDialog = () => {
        this.setState({ showDialog: true });
    }

    handleRequestConfirm = () => {
        const { message } = this.state;
        const { currentUserId, addRequestOnCurrentPost } = this.props;
        const { postId } = this.props.post;
        this.setState({
            showDialog: false,
            message: ''
        });
        addNewRequest(currentUserId, postId, message).then(() => {
            this.setState({ hasRequested: true });
            addRequestOnCurrentPost();
        });
    }

    handleRequestCancel = () => {
        this.setState({
            showDialog: false,
            message: ''
        });
    }

    handleClosePost = () => {
        const { setCurrentPostClosed } = this.props;
        const { postId } = this.props.post;
        closePost(postId).then(() => setCurrentPostClosed());
    }

    handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ message: event.target.value });
        event.preventDefault();
    }

    render() {
        const { currentUserId } = this.props;
        const {
            content, cost, costOption, isClosed,
            launchTime, ownerAvatarUrl, ownerGender, ownerId, ownerIdentity, ownerName,
            requestNum, requiredRegionName, tags,
            themeCoverUrl, themeName,
        } = this.props.post;

        const { message, showDialog, hasRequested } = this.state;

        let operations;
        if (ownerId === currentUserId) {
            const lessThan5Min = (new Date().getTime() - new Date(launchTime).getTime()) / 1000 / 60 < 5;
            operations = (
                <div>
                    {lessThan5Min ? <button>编辑</button> : null}
                    {isClosed ? null : <button onClick={this.handleClosePost}>关闭帖子</button>}
                </div>
            );
        } else {
            operations = hasRequested ?
                <button>已经约拍</button>
                : <button onClick={this.showRequestDialog}>我要约拍TA</button>;
        }

        return (
            <div>
                <section>
                    <div>
                        <img src={themeCoverUrl} alt="主题封面" />
                        <span>摄影主题</span>
                        <title>{themeName}</title>
                    </div>
                    <UserBrief
                        avatarUrl={ownerAvatarUrl}
                        gender={ownerGender}
                        identity={ownerIdentity}
                        regionCode={0}
                        regionName={''}
                        userId={ownerId}
                        userName={ownerName}
                    />
                    <table>
                        <tr>
                            <th>面向地区</th>
                            <th>费用</th>
                            <th>发布时间</th>
                        </tr>
                        <tr>
                            <td>{requiredRegionName}</td>
                            <td>{costOption + costOption === '需要收费' || costOption === '愿意付费' ? ` ${cost}元` : ''}</td>
                            <td>{launchTime}</td>
                        </tr>
                    </table>
                    <p>{content}</p>
                    <ul>
                        {tags.map(tag => <li key={tag}>{tag}</li>)}
                    </ul>
                    {requestNum > 0 ? <span>收到约拍{requestNum}条</span> : null}
                    {operations}
                </section>
                {showDialog ?
                    <Dialog
                        title="我要约拍TA"
                        onCancel={this.handleRequestCancel}
                        onConfirm={this.handleRequestConfirm}
                    >
                        <label>
                            约拍留言（必填）
                            <input
                                type="text"
                                value={message}
                                onChange={this.handleMessageChange}
                                placeholder="例如拍摄时间、地点、要求等"
                            />
                        </label>
                    </Dialog>
                    : null
                }
            </div>
        );

    }
}