import React, { Component } from "react";
import { Link } from "react-router";
import moment from "moment";

export default class ArticleList extends Component {
    render() {
        let href = `/${this.props.post.type}/${this.props.post.permalink}`;
        return (
            <article className="post">
                <div className="post-thumbnail">
                    <img
                        width="100"
                        src={this.props.post.cover_image}
                        alt={this.props.title}
                    />
                </div>
                <div className="post-header">
                    <h2 className="post-title font-alt">
                        <Link to={href}>
                            {this.props.post.title}
                        </Link>
                    </h2>
                    <div className="post-meta">
                        {moment(new Date(this.props.post.created_at)).format(
                            "LL"
                        )}
                    </div>
                </div>
                <div className="post-content">
                    <p>
                        {this.props.post.excerpt}
                    </p>
                    <a className="post-more" href="blog-single.html">
                        Read more →
                    </a>
                </div>
            </article>
        );
    }
}