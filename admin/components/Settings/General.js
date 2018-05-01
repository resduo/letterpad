import React, { Component } from "react";
import PropTypes from "prop-types";
import config from "config";
import { uploadFile } from "../../util";

export default class General extends Component {
    constructor(props) {
        super(props);
        this.updateOption = this.updateOption.bind(this);
        this.switchLanguage = this.switchLanguage.bind(this);

        this.uploadBanner = this.uploadBanner.bind(this);
        this.updateBanner = this.updateBanner.bind(this);

        this.state = {
            banner: this.props.data.banner.value
        };

        this.langOptions = JSON.parse(this.props.data.locale.value);
    }
    updateOption(option, value) {
        this.props.updateOption(option, value);
    }
    switchLanguage(e) {
        const locales = {};
        Object.keys(this.langOptions).map(lang => {
            locales[lang] = e.target.value === lang;
        });
        this.updateOption("locale", JSON.stringify(locales));
    }
    async uploadBanner(files) {
        const banner = await uploadFile({ files });
        this.updateOption("banner", banner);
        this.setState({ banner });
    }

    updateBanner(banner) {
        this.updateOption("banner", banner);
        this.setState({ banner });
    }
    render() {
        const checked = { row: {}, grid: {}, "two-column": {}, centered: {} };
        const { t } = this.context;
        const banner = this.state.banner || "";
        return (
            <div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.general.site.title")}
                    </label>
                    <input
                        defaultValue={this.props.data.site_title.value}
                        type="text"
                        className="form-control"
                        placeholder={t(
                            "settings.general.site.title.placeholder"
                        )}
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption("site_title", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.general.site.tagline")}
                    </label>
                    <input
                        defaultValue={this.props.data.site_tagline.value}
                        type="text"
                        className="form-control"
                        placeholder={t(
                            "settings.general.site.tagline.placeholder"
                        )}
                        aria-invalid="true"
                        onBlur={e =>
                            this.updateOption("site_tagline", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.general.site.email")}
                    </label>
                    <input
                        defaultValue={this.props.data.site_email.value}
                        type="email"
                        className="form-control"
                        placeholder="someone@somewhere.com"
                        aria-invalid="true"
                        onBlur={e =>
                            this.updateOption("site_email", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.general.site.description")}
                    </label>
                    <textarea
                        defaultValue={this.props.data.site_description.value}
                        className="form-control"
                        rows="2"
                        placeholder={t(
                            "settings.general.site.description.placeholder"
                        )}
                        required=""
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption(
                                "site_description",
                                e.target.value
                            )
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.general.site.url")}
                    </label>
                    <input
                        defaultValue={this.props.data.site_url.value}
                        type="text"
                        className="form-control"
                        placeholder={t("settings.general.site.url.placeholder")}
                        aria-invalid="true"
                        onBlur={e =>
                            this.updateOption("site_url", e.target.value)
                        }
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.general.site.footer")} (html allowed)
                    </label>
                    <textarea
                        defaultValue={this.props.data.site_footer.value}
                        className="form-control"
                        rows="2"
                        placeholder={t(
                            "settings.general.site.footer.placeholder"
                        )}
                        required=""
                        aria-invalid="false"
                        onBlur={e =>
                            this.updateOption("site_footer", e.target.value)
                        }
                    />
                </div>

                <div className="form-group">
                    <label className="custom-label">Upload Hero Banner</label>
                    <div className="banner-wrapper">
                        {!this.state.banner ? (
                            <a
                                href="#"
                                onClick={_ => this.refs.uploadInput.click()}
                            >
                                Add Banner
                            </a>
                        ) : (
                            <a href="#" onClick={_ => this.updateBanner("")}>
                                <div className="banner-image">
                                    <img width="300" alt="" src={config.baseName + banner} />
                                </div>
                                Remove Banner
                            </a>
                        )}
                    </div>
                    <input
                        ref="uploadInput"
                        onChange={input =>
                            this.uploadBanner(input.target.files)
                        }
                        type="file"
                        className="hide"
                        name="uploads[]"
                    />
                </div>
                <div className="form-group">
                    <label className="custom-label">
                        {t("settings.general.site.language")}
                    </label>
                    <select
                        onChange={this.switchLanguage}
                        className="form-control"
                    >
                        {Object.keys(this.langOptions).map(key => {
                            const selected = this.langOptions[key]
                                ? { selected: "" }
                                : {};
                            return (
                                <option {...selected} value={key}>
                                    {key}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
        );
    }
}

General.propTypes = {
    data: PropTypes.object,
    updateOption: PropTypes.func
};

General.contextTypes = {
    t: PropTypes.func
};