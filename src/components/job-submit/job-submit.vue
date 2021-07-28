<!--修改作业传入type为true-->
<template>
  <div>
    <van-action-sheet
      @cancel="cancelsheet"
      :close-on-click-overlay="false"
      @close="dropClose"
      v-model="dropDown"
      :title="showModification ? '修改作业' : '提交作业'"
    >
      <div class="pl-10 pr-10 sidebar-down">
        <div class="work-box">
          <div class="fs-14 fw-400 pt-12  clearfloat ">
            <div class="left fw-600" style="color: #646566">
              作业要求
            </div>
            <div
              v-if="isRequirementFooter"
              @click="isRequirementFooter = false"
              class="right fs-13 requirement"
              style="color:#2780F8 "
            >
              <div class="pr-20">
                收起
              </div>
              <img
                class="requirement-img"
                align="absmiddle"
                src="@/assets/images/up.png"
                alt=""
              />
            </div>
            <div
              v-if="!isRequirementFooter"
              @click="isRequirementFooter = true"
              class="right fs-13 requirement"
              style="color:#2780F8 "
            >
              <div class="pr-20">
                展开
              </div>
              <img
                class="requirement-img"
                align="absmiddle"
                src="@/assets/images/down.png"
                alt=""
              />
            </div>
          </div>
          <div class="lai-active">
            <div
              v-if="isRequirementFooter"
              class="fs-13 pt-10"
              style="color: #969799"
            >
              <u-editor-box
                v-if="classJump"
                :content="
                  homework.homework.desc != '' && homework.homework.desc != null
                    ? homework.homework.desc
                    : '暂无作业要求'
                "
              ></u-editor-box>
              <u-editor-box
                v-else
                :content="
                  classMsg.taskDescription != '' &&
                  classMsg.taskDescription != null
                    ? classMsg.taskDescription
                    : '暂无作业要求'
                "
              ></u-editor-box>
            </div>
          </div>
        </div>
        <div class="mt-10 fs-14 border-b" v-if="showModification">
          <div class="fs-15" style="color: #323233;font-weight: bold;">
            批改结果
          </div>
          <div style="color: #323233;position: relative" class="mt-10 mb-10">
            分值: <span style="color: #FFBB00">{{ homework.score }}分</span>
            <img class="unqualified" src="@/assets/images/buhege.png" alt="" />
          </div>
          <div style="color: #323233" v-if="homework.remark" class="mb-10">
            评语:
            <div class="mt-10" style="color:#646566">
              {{ homework.remark }}
            </div>
          </div>
        </div>
        <div v-for="(item, index) in homework.submitTypeDtos" :key="index">
          <div
            v-if="item.submitType === 1"
            class="clearfloat border-b pt-10 fs-14"
            style="color: #323233"
          >
            <div class="left" style="width: 25%">
              视频<span class="fs-12" style="color: #C8C9CC"
                >({{ item.requiredStatus == 0 ? "选填" : "必填" }})</span
              >
            </div>
            <div class="left" style="width: 75%">
              <div class="van-uploader">
                <div class="van-uploader__wrapper">
                  <div
                    class="van-uploader__preview"
                    v-for="(item, index) in fileVoiedList"
                    :key="index"
                    @click="watchHomework(index, 1)"
                  >
                    <div class="van-uploader__file">
                      <!--                      <div-->
                      <!--                        class="loding-video"-->
                      <!--                        v-if="index == uploadis && uploadis1"-->
                      <!--                      >-->
                      <!--                        <div class="mt-16">-->
                      <!--                          <van-circle-->
                      <!--                            v-model="currentRate"-->
                      <!--                            :rate="currentRate"-->
                      <!--                            :speed="50"-->
                      <!--                            :text="uploadText"-->
                      <!--                            size="45px"-->
                      <!--                          />-->
                      <!--                        </div>-->
                      <!--                      </div>-->
                      <i
                        class="van-icon van-icon-description van-uploader__file-icon"
                        ><!----></i
                      >
                      <div class="van-uploader__file-name van-ellipsis">
                        {{ item.name }}
                      </div>
                      <i
                        @click="deleteVideo(index)"
                        v-if="!(currentRate != 100)"
                        class="van-icon van-icon-clear deleteButton"
                        ><!----></i
                      >
                    </div>
                  </div>
                  <div class="van-uploader__upload">
                    <i
                      class="van-icon van-icon-photograph van-uploader__upload-icon"
                      ><!----></i
                    ><input
                      type="file"
                      accept="video/*"
                      ref="video"
                      @change="changeVideo($event, 1)"
                      class="van-uploader__input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="item.submitType === 0"
            class="clearfloat border-b pt-10 fs-14"
            style="color: #323233"
          >
            <div class="left" style="width: 25%">
              图片<span class="fs-12" style="color: #C8C9CC"
                >({{ item.requiredStatus == 0 ? "选填" : "必填" }})</span
              >
            </div>
            <div class="left" style="width: 75%">
              <div class="van-uploader">
                <div class="van-uploader__wrapper">
                  <div
                    class="van-uploader__preview"
                    v-for="(item, index) in fileImgList"
                    :key="index"
                  >
                    <div class="van-image van-uploader__preview-image">
                      <img
                        :src="item.url"
                        class="van-image__img"
                        style="object-fit: cover;"
                        @click="sceneImg(index)"
                      />
                    </div>
                    <i
                      @click="deleteImg(index)"
                      class="van-icon van-icon-clear deleteButton"
                      ><!----></i
                    >
                  </div>
                  <div class="van-uploader__upload">
                    <i
                      class="van-icon van-icon-photograph van-uploader__upload-icon"
                      ><!----></i
                    ><input
                      type="file"
                      accept="image/*"
                      ref="img"
                      @change="changeImage($event)"
                      class="van-uploader__input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="item.submitType === 2"
            class="clearfloat border-b pt-10 fs-14"
            style="color: #323233"
          >
            <div class="left" style="width: 25%">
              音频<span class="fs-12" style="color: #C8C9CC"
                >({{ item.requiredStatus == 0 ? "选填" : "必填" }})</span
              >
            </div>
            <div class="left" style="width: 75%">
              <div class="van-uploader">
                <div class="van-uploader__wrapper">
                  <div
                    class="van-uploader__preview"
                    v-for="(item, index) in fileMpList"
                    :key="index"
                    @click="watchHomework(index, 2)"
                  >
                    <div class="van-uploader__file">
                      <!--                      <div-->
                      <!--                        class="loding-video"-->
                      <!--                        v-if="index == mpvideo && mpvideo1"-->
                      <!--                      >-->
                      <!--                        <div class="mt-16">-->
                      <!--                          <van-circle-->
                      <!--                            v-model="currentRate"-->
                      <!--                            :rate="currentRate"-->
                      <!--                            :speed="50"-->
                      <!--                            :text="uploadText"-->
                      <!--                            size="45px"-->
                      <!--                          />-->
                      <!--                        </div>-->
                      <!--                      </div>-->
                      <i
                        class="van-icon van-icon-description van-uploader__file-icon"
                        ><!----></i
                      >
                      <div class="van-uploader__file-name van-ellipsis">
                        {{ item.name }}
                      </div>
                      <i
                        @click="deleteMp(index)"
                        v-if="!(currentRate != 100)"
                        class="van-icon van-icon-clear deleteButton"
                        ><!----></i
                      >
                    </div>
                  </div>
                  <div class="van-uploader__upload">
                    <i
                      class="van-icon van-icon-photograph van-uploader__upload-icon"
                      ><!----></i
                    ><input
                      type="file"
                      ref="audio"
                      @change="changeVideo($event, 2)"
                      class="van-uploader__input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="item.submitType === 3"
            class="clearfloat border-b pt-10 fs-14"
            style="color: #323233"
          >
            <div class="left" style="width: 25%">
              文档<span class="fs-12" style="color: #C8C9CC"
                >({{ item.requiredStatus == 0 ? "选填" : "必填" }})</span
              >
              <van-icon
                color="rgb(200, 201, 204)"
                @click="prompt"
                style="vertical-align: bottom;"
                name="question-o"
              />
            </div>
            <div class="left" style="width: 75%">
              <div class="van-uploader">
                <div class="van-uploader__wrapper">
                  <div
                    v-for="(item, index) in docList"
                    style="position: relative"
                    :key="index"
                    @click="documentPreview(index)"
                  >
                    <img class="docimg" src="@/assets/images/file.png" alt="" />
                    <i
                      @click="deleteFiles(index)"
                      style="position: absolute;top: 0;right: 0"
                      class="van-icon van-icon-clear deleteButton"
                      ><!----></i
                    >
                  </div>
                  <div class="van-uploader__upload">
                    <i
                      class="van-icon van-icon-photograph van-uploader__upload-icon"
                      ><!----></i
                    ><input
                      type="file"
                      @change="uploadFile($event)"
                      class="van-uploader__input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="item.submitType === 4"
            class="clearfloat border-b pt-10 fs-14"
            style="color: #323233"
          >
            <div class="left" style="width: 30%">
              描述内容<span class="fs-12" style="color: #C8C9CC"
                >({{ item.requiredStatus == 0 ? "选填" : "必填" }})</span
              >
            </div>
            <div class="left mt-4" style="width: 70%;padding: 0">
              <van-field
                v-model="workMsg"
                style="padding: 0"
                type="textarea"
                placeholder="请输入"
                rows="3"
                :border="false"
              />
            </div>
          </div>
        </div>
        <div
          v-if="classMsg.pkStatus == 1 && isPkShow"
          class="clearfloat border-b pt-10 fs-14"
          style="color: #323233"
        >
          <div class="left" style="width: 27%">
            是否参与pk
          </div>

          <div class="left pl-5 mb-30" style="width: 72%;">
            <van-switch size="18px" v-model="pkChecked" />
          </div>
        </div>
        <div class="ding"></div>
      </div>
      <button @click="uploadWork" class="lai-submit">
        提 交
      </button>
    </van-action-sheet>
    <van-popup v-model="isVideoPlayer">
      <div v-if="isVideoPlayer" style="width: 375px;margin: 0 auto">
        <VideoPlayer
          :mediaType="mediaType"
          :vid="liveId"
          :video-container-height="200"
        ></VideoPlayer>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import { CloudMarketing } from "@/request";
import axios from "axios";
import JSH from "@/core";
import AliyunUploadVideo from "@/utils/aliyunUploadVideo";
import VideoPlayer from "@/components/VideoPlayerTwo";
import { UEditorBox } from "@jsh/helper/components";
import {
  Field,
  CellGroup,
  Search,
  Card,
  Button,
  Uploader,
  ActionSheet,
  Switch,
  Loading,
  Overlay,
  ImagePreview,
  Dialog,
  Circle,
  Toast
} from "vant";

Vue.use(Field);
Vue.use(CellGroup)
  .use(Search)
  .use(Card)
  .use(Dialog)
  .use(Uploader)
  .use(ActionSheet)
  .use(Switch)
  .use(ImagePreview)
  .use(Toast)
  .use(Loading)
  .use(Circle)
  .use(Overlay)
  .use(Button);

export default {
  name: "job-submit",
  // props: ["jobObj"],
  components: { VideoPlayer, UEditorBox },
  data() {
    return {
      //按钮防止二次点击
      againTrigger: false,
      jobObj: null,
      //展开收起
      isRequirementFooter: true,
      //弹框开关
      dropDown: false,
      // 视频播放开关
      isVideoPlayer: false,
      liveId: "",
      //课程信息
      classMsg: {},
      //上传进度
      currentRate: 100,
      uploadText: "0%",
      //上传的图片
      fileVoiedList: [],
      fileMpList: [],
      fileImgList: [],
      // 描述内容
      workMsg: "",
      pkChecked: false,
      submitDetail: CloudMarketing.getHomeworkSubmitDetail,
      //上传图片的合集
      images: [],
      //作业提交
      workDates: [],
      workDatesVideo: [],
      workDatesMp: [],
      //上传视频的进度状态
      uploadis: 0,
      mpvideo: 0,
      uploadis1: true,
      mpvideo1: true,
      isPkShow: true,
      etag: "",
      percent: 1,
      classJump: null,
      docList: [],
      // 显示修改内容
      showModification: false,
      homework: {},
      workDatesDoc: [],
      mediaType: "video",
      //提交状态
      submissionStatus: true,
      // 文档合集
      documentCollection: []
    };
  },
  methods: {
    //关闭面板
    cancelsheet() {
      if (this.currentRate != 100) {
        Toast("请等待上传完毕");
        this.dropDown = true;
      } else {
        this.dropDown = false;
      }
    },
    // pk时间的判断
    isPkNow() {
      const owner = this;
      if (
        owner.classMsg.pkStartTime !== null &&
        owner.classMsg.pkStartTime !== ""
      ) {
        //    有值判断 在前 还是在后
        const now = Date.parse(new Date());
        const start = Number(owner.classMsg.pkStartTime);
        const end = Number(owner.classMsg.pkEndTime);
        if (now < start) {
          owner.isPkShow = false;
        }
        if (now > end) {
          owner.isPkShow = false;
        }
        // const startTime = value.studyStartTime
      }
    },
    //删除文件
    deleteFiles(index) {
      this.docList.splice(index, 1);
      this.workDatesDoc.splice(index, 1);
    },
    //关闭时
    dropClose() {
      //上传的图片
      this.fileVoiedList = [];
      this.fileMpList = [];
      this.fileImgList = [];
      this.workDates = [];
      this.docList = [];
      this.workDatesVideo = [];
      this.workDatesMp = [];
      this.images = [];
      this.workMsg = "";
      this.pkChecked = false;
      this.$emit("close");
    },
    // 提示
    prompt() {
      Dialog.alert({
        title: "格式说明",
        message:
          "支持doc、docx、wps、ppt、pptx、pdf文件格式 ，不支持表格文件，可自行转化为pdf格式后上传",
        confirmButtonColor: "#2780F8",
        confirmButtonText: "知道了"
      }).then(() => {
        // on close
      });
    },
    // 文档预览
    documentPreview(index) {
      this.documentCollection = [];
      this.getPage(this.workDatesDoc[index].value);
    },
    // 文档上传
    uploadFile(event) {
      const owner = this;
      const file = event.target.files[0];
      const fileName = file.name.toLowerCase();
      event.target.value = "";
      //校验
      if (!fileName.match(/^.*\.(doc|docx|wps|ppt|pptx|pdf)$/i)) {
        Toast("文件格式不正确");
        return;
      }
      let formData = new FormData();
      formData.append("file", file);
      Toast.loading({
        message: "上传中...",
        forbidClick: true,
        duration: 0
      });
      // this.uploadLoading = true;
      JSH.request({
        url: CloudMarketing.uploadFile,
        method: "post",
        contentType: "form",
        params: formData,
        success(resp) {
          if (resp.success) {
            owner.etag = resp.data.etag;
            owner.docList.push({
              liveType: this.liveType,
              sourceType: this.sourceType,
              liveName: file.name,
              liveId: resp.data.etag,
              isEdit: false
            });
            owner.workDatesDoc.push({
              type: 3,
              value: resp.data.etag
            });
            Toast.clear();
            // owner.getFileResult();
          } else {
            Toast(resp.errorMsg);
            setTimeout(() => {
              Toast.clear();
            }, 1000);
          }
        },
        error() {
          Toast("接口异常");
        }
      });
    },
    // 检测上传状态
    getFileResult() {
      let owner = this;
      JSH.request({
        url: CloudMarketing.getFileResult,
        method: "get",
        params: {
          etag: owner.etag
        },
        success(res) {
          if (res.success) {
            if (res.data.status === 3) {
              // this.progress = '100%';
              // this.uploadLoading = false;
            } else {
              setTimeout(() => {
                owner.getFileResult();
              }, 1000);
            }
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    // 判断是否必填为全填
    judgeRequired() {
      for (let i = 0; i < this.homework.submitTypeDtos.length; i += 1) {
        let item = this.homework.submitTypeDtos[i];
        if (
          item.submitType == 0 &&
          this.workDates.length == 0 &&
          item.requiredStatus == 1
        ) {
          this.submissionStatus = false;
        }
        if (
          item.submitType == 1 &&
          this.workDatesVideo.length == 0 &&
          item.requiredStatus == 1
        ) {
          this.submissionStatus = false;
        }
        if (
          item.submitType == 2 &&
          this.workDatesMp.length == 0 &&
          item.requiredStatus == 1
        ) {
          this.submissionStatus = false;
        }
        if (
          item.submitType == 3 &&
          this.workDatesDoc.length == 0 &&
          item.requiredStatus == 1
        ) {
          this.submissionStatus = false;
        }
        if (
          item.submitType == 4 &&
          this.workMsg == "" &&
          item.requiredStatus == 1
        ) {
          this.submissionStatus = false;
        }
      }
    },
    //提交作业
    uploadWork() {
      console.log(this.jobObj);
      this.submissionStatus = true;
      this.judgeRequired();
      if (
        this.workDates.length === 0 &&
        this.workDatesVideo.length === 0 &&
        this.workDatesMp.length === 0 &&
        this.workDatesDoc.length === 0 &&
        (this.workMsg === "" ||
          this.workMsg === null ||
          this.workMsg === undefined)
      ) {
        Toast("请至少选择一种提交方式");
        return;
      }
      if (!this.submissionStatus) {
        Toast("请填写必填项");
      } else if (this.currentRate != 100) {
        Toast("请等待上传完毕");
      } else {
        let that = this;
        let isPk = ""; // eslint-disable-line no-unused-vars
        if (that.pkChecked) {
          isPk = 1;
        } else {
          isPk = 0;
        }
        console.log([
          ...that.workDates,
          ...that.workDatesVideo,
          ...that.workDatesMp,
          ...that.workDatesDoc
        ]);
        //防重复点击，接口调用成功后再走
        if (that.againTrigger) {
          return;
        }
        that.againTrigger = true;
        this.$emit("submit", {
          homeworkId: that.jobObj.homeworkId,
          desc: that.workMsg,
          isPk: isPk,
          dataDtoList: [
            ...that.workDates,
            ...that.workDatesVideo,
            ...that.workDatesMp,
            ...that.workDatesDoc
          ]
        });
      }
    },
    //关闭
    close() {
      this.dropDown = false;
    },
    // 获取作业详情11111111
    getJobDetails() {
      const that = this;
      JSH.request({
        url: that.submitDetail,
        method: "get",
        params: {
          homeworkSubmitId: that.jobObj.homeworkSubmitId
            ? that.jobObj.homeworkSubmitId
            : "",
          homeworkId: that.jobObj.homeworkId
        },
        success(res) {
          if (res.success) {
            that.workMsg = res.data.desc;
            if (res.data.isPk == 1) {
              that.pkChecked = true;
            } else {
              that.pkChecked = false;
            }
            if (res.data.dates) {
              that.uploadis = 1;
              that.mpvideo = 1;
              res.data.dates.forEach(item => {
                delete item.id;
                if (item.type == 0) {
                  that.workDates.push(item);
                  item.url = item.value;
                  that.fileImgList.push(item);
                  that.images.push(item.value);
                  that.$forceUpdate();
                }
                if (item.type == 1) {
                  item.taskId = item.value;
                  that.fileVoiedList.push(item);
                  that.workDatesVideo.push(item);
                }
                if (item.type == 2) {
                  that.fileMpList.push(item);
                  that.workDatesMp.push(item);
                }
                if (item.type == 3) {
                  that.docList.push(item);
                  that.workDatesDoc.push(item);
                }
              });
            }
            that.homework = res.data;
          } else {
            Toast(res.errorMsg);
          }
        },
        error(e) {
          console.log(e);
        }
      });
    },
    // 展开
    show(data) {
      this.againTrigger = false;
      this.dropDown = true;
      this.jobObj = data;
      if (this.jobObj.type) {
        this.showModification = true;
      } else {
        this.showModification = false;
      }
      this.classJump = data.classJump;
      if (data.classJump && Number(data.classJump) === 1) {
        this.submitDetail = CloudMarketing.getClassHomeworkSubmitDetail;
      } else {
        this.getCollegeMarketingById();
      }
      this.getJobDetails();
    },

    //获取课程详情
    getCollegeMarketingById() {
      let that = this;
      JSH.request({
        url: CloudMarketing.getCourseDetail,
        method: "get",
        params: {
          id: that.jobObj.courseId
        },
        success(res) {
          if (res.success) {
            that.classMsg = res.data;
            that.isPkNow();
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          Toast("接口异常");
        }
      });
    },
    //上传视频开始
    changeVideo(e, type) {
      const that = this;
      let file = e.target.files[0];
      const fileName = file.name.toLowerCase();
      if (that.percent != 1) {
        Toast("请等待上传完成");
        if (type == 1) {
          that.$refs.video.value = null;
        } else {
          that.$refs.audio.value = null;
        }
        return;
      }
      if (file.type.split("/")[0] != "video" && type == 1) {
        Toast("视频格式不正确");
        return;
      }
      if (!fileName.match(/^.*\.(mp3|wav|m4a)$/i) && type == 2) {
        Toast("音频格式不正确,请上传mp3、wav、m4a格式");
        return;
      }
      let item = {
        name: file.name,
        time: new Date(),
        type: file.type,
        size: file.size
      };
      Toast.loading({
        message: "上传中 0%",
        forbidClick: true,
        duration: 0
      });
      new AliyunUploadVideo({
        catId: AliyunUploadVideo.catIds.liveAction,
        file,
        onStarted: () => {
          if (type == 1) {
            that.uploadis = that.workDatesVideo.length;
            that.percent = 0;
            that.uploadText = 0;
            that.currentRate = 0;
            that.uploadis1 = true;
          }
          if (type == 2) {
            that.mpvideo = that.workDatesMp.length;
            that.percent = 0;
            that.uploadText = 0;
            that.currentRate = 0;
            that.mpvideo1 = true;
          }
        },
        onSuccess: uploadInfo => {
          let that = this;
          JSH.request({
            url: CloudMarketing.transcodejob,
            method: "get",
            params: {
              videoId: uploadInfo.videoId
            },
            success(res) {
              if (res.success) {
                if (type == 1) {
                  let item = {
                    type: 1,
                    value: uploadInfo.videoId,
                    taskId: res.data
                  };
                  that.workDatesVideo.push(item);
                }
                if (type == 2) {
                  let item = {
                    type: 2,
                    value: uploadInfo.videoId,
                    taskId: res.data
                  };
                  that.workDatesMp.push(item);
                }
              } else {
                Toast(res.errorMsg);
              }
            },
            error() {
              Toast("接口异常");
            }
          });
        },
        onFailed: () => {
          Toast("上传失败");
          that.percent = 1;
          that.currentRate = parseInt(that.percent * 100);
          that.uploadText = parseInt(that.percent * 100) + "%";
          if (that.percent == 1) {
            that.uploadis = false;
            that.uploadis1 = false;
            that.mpvideo = false;
            that.mpvideo1 = false;
          }
          // if (type == 1) {
          //   that.workDatesMp.splice(that.workDatesVideo.length - 1, 1);
          // }
          // if (type == 2) {
          //   that.workDatesMp.splice(that.fileMpList.length - 1, 1);
          // }
        },
        onProgress: (info, size, percent) => {
          that.percent = percent;
          that.currentRate = parseInt(percent * 100);
          that.uploadText = parseInt(percent * 100) + "%";
          Toast.loading({
            message: "上传中 " + this.uploadText,
            forbidClick: true,
            duration: 0
          });
          if (percent == 1) {
            that.uploadis = false;
            that.uploadis1 = false;
            that.mpvideo = false;
            that.mpvideo1 = false;
            if (type == 1) {
              this.fileVoiedList.push(item);
            }
            if (type == 2) {
              this.fileMpList.push(item);
            }
            Toast.clear();
          }
        }
      });
      that.$refs.video.value = null;
      that.$refs.audio.value = null;
      e.target.value = "";
    },
    //删除上传的视频
    deleteVideo: function(index) {
      this.fileVoiedList.splice(index, 1);
      this.workDatesVideo.splice(index, 1);
    },
    //删除上传的音频
    deleteMp: function(index) {
      this.fileMpList.splice(index, 1);
      this.workDatesMp.splice(index, 1);
    },
    // 查看视频
    watchHomework(index, type) {
      if (type === 1) {
        this.liveId = this.workDatesVideo[index].value;
        this.mediaType = "video";
        this.isVideoPlayer = true;
      }
      if (type === 2) {
        this.liveId = this.workDatesMp[index].value;
        this.mediaType = "audio";
        this.isVideoPlayer = true;
      }
    },
    //获取文档流
    getMsg(liveId, page, tag) {
      let that = this;
      JSH.request({
        url: CloudMarketing.getDocPicUrl,
        method: "get",
        params: {
          etag: liveId,
          pageIndex: page
        },
        success(res) {
          if (res.success) {
            that.documentCollection.push(res.data.url);
            if (tag) {
              ImagePreview(that.documentCollection);
            }
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          Toast("接口异常");
        }
      });
    },
    // 获取总页数
    getPage(liveId) {
      let that = this;
      JSH.request({
        url: CloudMarketing.getFileResult,
        method: "get",
        params: {
          etag: liveId
        },
        success(res) {
          if (res.success) {
            if (res.data.status != 3) {
              Toast("文档还未转换完成请稍后再试!");
              return;
            }
            let tag = false;
            for (let i = 0; i < res.data.pageCount; i += 1) {
              if (i == res.data.pageCount - 1) {
                tag = true;
              }
              that.getMsg(liveId, i + 1, tag);
            }
          } else {
            Toast(res.errorMsg);
          }
        },
        error() {
          Toast("接口异常");
        }
      });
    },
    //上传图片开始
    changeImage(e) {
      let file = e.target.files[0];
      if (file.type.split("/")[0] != "image") {
        Toast("格式不正确");
      } else {
        Toast.loading({
          message: "上传中...",
          forbidClick: true,
          duration: 0
        });
        let formData = new FormData();
        formData.append("file", file);
        let config = {
          headers: { "Content-Type": "multipart/form-data" }
        }; //添加请求头
        let that = this;
        axios
          .post(CloudMarketing.uploadImgFile, formData, config)
          .then(response => {
            if (response.data.success) {
              let item = {
                type: 0,
                value: response.data.data
              };
              that.workDates.push(item);
              Toast.clear();
            } else {
              Toast(response.data.errorMsg);
            }
          })
          .catch(e => {
            console.log(e);
            Toast("接口异常");
          });
        let item = {
          name: file.name,
          time: new Date(),
          type: file.type,
          size: file.size
        };
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = e => {
          //压缩图片并存到fileItem中
          this.getBase64(e.target.result).then(url => {
            item.url = url;
            that.fileImgList.push(item);
            that.images.push(url);
            that.$forceUpdate();
          });
        };
        that.$refs.img.value = null;
      }
      e.target.value = "";
    },
    //删除上传的图片
    deleteImg: function(index) {
      this.fileImgList.splice(index, 1);
      this.images.splice(index, 1);
      this.workDates.splice(index, 1);
    },
    //图片转换base64
    getBase64(url) {
      let Img = new Image(),
        dataURL = "";
      Img.src = url;
      let p = new Promise(function(resolve) {
        Img.onload = function() {
          //要先确保图片完整获取到，这是个异步事件
          let canvas = document.createElement("canvas"), //创建canvas元素
            width = Img.width, //确保canvas的尺寸和图片一样
            height = Img.height;
          // 默认将长宽设置为图片的原始长宽，这样在长宽不超过最大长度时就不需要再处理
          let ratio = width / height,
            maxLength = 1000,
            newHeight = height,
            newWidth = width;
          // 在长宽超过最大长度时，按图片长宽比例等比缩小
          if (width > maxLength || height > maxLength) {
            if (width > height) {
              newWidth = maxLength;
              newHeight = maxLength / ratio;
            } else {
              newWidth = maxLength * ratio;
              newHeight = maxLength;
            }
          }
          canvas.width = newWidth;
          canvas.height = newHeight;
          canvas.getContext("2d").drawImage(Img, 0, 0, newWidth, newHeight); //将图片绘制到canvas中
          dataURL = canvas.toDataURL("image/jpeg", 0.5); //转换图片为dataURL
          resolve(dataURL);
        };
      });
      return p;
    },

    //vant 图片预览
    sceneImg(index) {
      ImagePreview({
        images: this.images, //需要预览的图片 URL 数组
        showIndex: true, //是否显示页码
        loop: false, //是否开启循环播放
        startPosition: index //图片预览起始位置索引
      });
    },
    //vant 图片预览一张
    sceneImgOne(url) {
      ImagePreview({
        images: [url], //需要预览的图片 URL 数组
        showIndex: false, //是否显示页码
        loop: false, //是否开启循环播放
        startPosition: 0 //图片预览起始位置索引
      });
    }
  },
  activated() {},
  deactivated() {},
  created() {
    //获取课程详情
    // this.getCollegeMarketingById();
    //this.getJobDetails();
  }
};
</script>
<style lang="scss">
.lai-active {
  width: 100%;
  .ql-align-center {
    text-align: center;
  }
  .ql-align-right {
    text-align: right;
  }
  img {
    width: 100%;
  }
}
</style>
<style scoped>
.van-action-sheet__cancel,
.van-action-sheet__item {
  display: block;
  width: 100%;
  font-size: 16px;
  line-height: 50px;
  text-align: center;
  background-color: #2780f8;
  color: #ffffff;
  border: 0;
  font-weight: 500;
}
/deep/.van-circle__text {
  color: #ffffff;
}
/deep/.van-uploader__preview-image {
  display: block;
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 8px;
}
/deep/.van-uploader__file {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: #f7f8fa;
  border-radius: 8px;
}
/deep/.van-uploader__upload {
  border: none;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  box-sizing: border-box;
  width: 80px;
  height: 80px;
  margin: 0 8px 8px 0;
  background-color: #f7f8fa;
  border-radius: 8px;
}
.van-action-sheet__cancel::before {
  display: none;
}
</style>
<style lang="scss" scoped>
.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.deleteButton {
  position: absolute;
  top: -8px;
  right: -8px;
  color: #969799;
  font-size: 18px;
  background-color: #fff;
  border-radius: 100%;
}
.clearfloat {
  zoom: 1;
}
.loding-video {
  position: absolute;
  left: 0;
  top: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  text-align: center;
  background-color: rgba(50, 50, 51, 0.88);
}
.work-button {
  color: #2780f8;
  border: 1px solid #2780f8;
  border-radius: 15px;
  width: 80px;
  padding: 3px 0;
  font-size: 14px;
  margin: 0 auto;
}
.docimg {
  width: 80px;
}
.mt-4 {
  margin-top: -3px;
}
.loading {
  text-align: center;
  width: 130px;
  margin: 350px auto 0;
  background-color: #222222;
  height: 80px;
  border-radius: 5px;
  line-height: 80px;
  .loadingmsg {
    color: #ffffff;
    font-size: 14px;
  }
}
.sidebar-down {
  max-height: 500px;
  width: 100%;
  overflow: auto;
  overflow-x: hidden;
}
.requirement {
  position: relative;
  .requirement-img {
    width: 16px;
    position: absolute;
    right: 0;
    top: 0;
  }
}
.no-msg {
  width: 60px;
  height: 60px;
}
.border-b {
  border-bottom: 1px solid rgba(220, 222, 224, 1);
}
.left {
  float: left;
}
.right {
  float: right;
}
.pkImg {
  width: 47px;
  height: 14px;
}
.unqualified {
  width: 50px;
  position: absolute;
  left: 80px;
  top: -25px;
}
.work-box {
  background: #f2f3f5;
  border-radius: 10px;
  padding: 0 10px 10px;
}
.swipe-loder {
  width: 60%;
  vertical-align: middle;
  background-color: white;
  display: inline-block;
}
.ding {
  width: 100%;
  height: 80px;
}
.lai-submit {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: block;
  width: 100%;
  font-size: 4.26667vw;
  line-height: 13.33333vw;
  text-align: center;
  background-color: #2780f8;
  color: #ffffff;
  border: 0;
  font-weight: 500;
  height: 50px;
  z-index: 99;
}
</style>
