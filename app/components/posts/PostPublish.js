import React, { Component } from "react";
import PostActions from "./PostActions";
import { gql, graphql } from "react-apollo";

const actions = {
    publish: "Published",
    draft: "Save Draft"
};
class PostPublish extends Component {
    updatePost(e, status) {
        e.preventDefault();
        PostActions.setData(status);
        let data = PostActions.getData();
        return this.props
            .update({
                ...this.props.post,
                ...data
            })
            .then(result => {
                PostActions.postUpdated(result.data.updatePost.id);
            });
    }

    getButton(status, label, btnType = "btn-dark") {
        return (
            <div className="btn-group btn-item">
                <button
                    type="submit"
                    onClick={e => this.updatePost(e, { status: status })}
                    className={"btn btn-md " + btnType}
                >
                    {label}
                </button>
            </div>
        );
    }

    render() {
        return (
            <div className="x_panel m-b-20">
                <div className="x_content">
                    <div className="btn-group btn-group-justified">
                        {this.getButton("publish", "Publish", "btn-info")}
                        {this.getButton("draft", "Save Draft")}
                        {this.getButton("deleted", "Trash")}
                    </div>
                </div>
            </div>
        );
    }
}

const updatePostQuery = gql`
  mutation updatePost($id: Int!, $title: String!, $body: String!, $status: String!, $excerpt: String!, $taxonomies: [TaxonomyInputType]) {
    updatePost(id: $id, title: $title, body: $body, status: $status, excerpt: $excerpt, taxonomies: $taxonomies) {
        id,
        title,
        body,
        author {
            username
        },
        type,
        status,
        excerpt,
        created_at,
        cover_image,
        taxonomies {
            id,
            name,
            type
        }
    }
  }
`;
const updateQueryWithData = graphql(updatePostQuery, {
    props: ({ mutate }) => ({
        update: data => mutate({
            variables: data,
            updateQueries: {
                getPost: (prev, { mutationResult }) => {
                    debugger;
                    return {
                        post: {
                            ...prev.post,
                            ...mutationResult.data.updatePost
                        }
                    };
                }
            }
        })
    })
});
export default updateQueryWithData(PostPublish);