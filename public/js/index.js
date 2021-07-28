/* eslint-disable no-undef */
$(function () {
    var comments = [];
    const _checkData = { checkUser: [], checkMsg: [] }
    var checkData = _checkData

    $(".push").on("click", function () {
        let data = $(this).parent();

        let url = data.find("input[name='url']");
        let startText = data.find("input[name='startText']");
        let endText = data.find("input[name='endText']");

        if (url.val().match(/(http(s?):(\/\/|\\\\)www\.youtube\.com\/([=A-Za-z0-9-_&])*(watch\?v=([A-Za-z0-9-_])*))/g) !== null) {
            $.getJSON(`/api/comment?videoId=${url.val().match(/(watch\?v=([A-Za-z0-9-_]*))/)[0].substring(8)}`,
                function (data) {
                    if ("error" in data) {
                        $(".random").addClass("none");
                        if (data.error.code === 404) {
                            return $(".output").html("找無該影片")
                        } else {
                            return $(".output").html(`錯誤!! errorCode: ${data.error.code}<dr>${data.error.msg}`)
                        }
                    }
                    checkData = _checkData
                    $(".output").html("");
                    for (let i of data) {
                        $(".output").append(
                            `<div><div class="commentUser"><img src="${i.avatar}" class="userIcon"><h3 class="userName">${i.authorName}</h3><p class="time">${time_ago(i.time.send)}</p></div><div><div class="content">${i.txtHtml}</div></div></div>`
                        );
                    }
                    $(".random").removeClass("none")
                    comments = data;
                    if (startText.val().length > 0 || endText.val().length > 0) {
                        comments = [];
                        $(".output").html("");
                        data.filter(function (ctx) {
                            let apiTxt = ctx.txtJs;
                            let check = () => {
                                if (startText.val().length > 0) {
                                    let startOf = apiTxt.lastIndexOf(startText.val());
                                    if (startOf === -1) {
                                        return apiTxt.length;
                                    } else {
                                        return startOf;
                                    }
                                } else {
                                    return 0;
                                }
                            };
                            let checkEnd = () => {
                                if (endText.val().length > 0) {
                                    let endTextOf = apiTxt.lastIndexOf(endText.val());
                                    if (endTextOf === -1) {
                                        return 0;
                                    } else {
                                        return endTextOf;
                                    }
                                } else {
                                    return apiTxt.length;
                                }
                            };
                            if (check() < checkEnd()) {
                                comments.push(ctx)
                                $(".output").append(`<div><div class="commentUser"><img src="${ctx.avatar}" class="userIcon"><h3 class="userName">${ctx.authorName}</h3><p class="time">${time_ago(ctx.time.send)}</p></div><div><div class="content">${ctx.txtHtml}</div></div></div>`);
                            }
                        });
                    }
                }
            );
        } else {
            $(".random").addClass("none");
            url.css("border-color", "red");
            url.change(function () {
                $(this).css("border-color", "");
            });
        }
    });
    $(".randomOn").on("click", function () {
        let getRandom = () => {
            let _randomComment = comments[Math.floor(Math.random() * comments.length)];
            if (checkData.checkMsg.length < comments.length && checkData.checkUser.length < comments.length) {
                return ($("#checkUser").attr("checked") && checkData.checkUser.lastIndexOf(_randomComment.userId) > -1
                    || $("#checkMsg").attr("checked") && checkData.checkMsg.lastIndexOf(_randomComment.id) > -1
                    ? getRandom() : _randomComment);
            }
            return null
        }
        let randomComment = getRandom();
        if (randomComment !== null) {
            checkData.checkMsg.push(randomComment.id);
            checkData.checkUser.push(randomComment.userId);

            $(".output").html(`<div><div class="commentUser"><img src="${randomComment.avatar}" class="userIcon"><h3 class="userName">${randomComment.authorName}</h3><p class="time">${time_ago(randomComment.time.send)}</p></div><div><div class="content">${randomComment.txtHtml}</div></div></div>`);
        } else {
            $(".output").html("無");
        }
    })
    $("input[type='checkbox']").on("click", function () {
        $(this).attr("checked") ? $(this).removeAttr("checked") : $(this).attr("checked", "");
    });
});