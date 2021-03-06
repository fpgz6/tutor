(function(){
Vue.http.interceptors.push(function(request, next){
  request.credentials = true;
  next();
});
var vm = new Vue({
  el: 'body',
  data: {
    domain: 'http://shaozi.beansonbar.cn',
    timer: null,
  	hintData: {
  	   status: false,
  	   text: '',
  	},
  	status:{
  	   isSubmit: false,
       isLoading: false,
       isUploadImg: true,
       isPrice: false,
       isNotice: false,
       isSelected: true,
       // getLocation: true,

  	},
    salary: '',
    notice: '',
    Arr: {
      gradeArr: [],
      subjectArr: [],
      teacher_method_arr: [],
    },
    location:{
      latitude:'',
      longitude:'',
      // speed:'',
      // accuracy:'',
    },
    images:{
      certificate_photo:'',
      teach_show_photo: [
        {img:''},
        {img:''},
        {img:''}
      ],
    },
    signature: '',
  	form: {
       name: '',
       qualification:1,
       number: '',
  	   sex: 1,
  	   native_place: '',
  	   campus_major: '',
  	   tel: '',
       grade:'',
       subject: '',
       subject_other: '',
  	   place: '',
       teacher_method: '',
       self_comment: '',
       salary_bottom: Number,
       salary_top:Number,
       score: '', 
       certificate_photo: '',
       teach_show_photo: [
          {img:''},
          {img:''},
          {img:''}
       ],
       teacher_method_other: '',
       mon_begin:'',
        mon_end: '',
        tues_begin:'',
        tues_end: '',
        wed_begin: '',
        wed_end: '',
        thur_begin: '',
        thur_end: '',
        fri_begin: '',
        fri_end: '',
        sat_morning: 0,
        sat_afternoon: 0,
        sat_evening: 0,
        sun_morning: 0,
        sun_afternoon: 0,
        sun_evening: 0,
  	},
    time:{
      Mon: [],
      Tue: [],
      Wed: [],
      Thr: [],
      Fri: [],
    },
    
    formGroup:[{
      value: [
       {"key": 'Mon',"tag": "周一",'begin':'mon_begin','end':'mon_end'},{"key": "Tue","tag": "周二",'begin':'tues_begin','end':'tues_end'},{"key": 'Wed',"tag": "周三",'begin':'wed_begin','end':'wed_end'},{"key": "Thr","tag": "周四",'begin':'thur_begin','end':'thur_end'},{"key": "Fri","tag": "周五",'begin':'fri_begin','end':'fri_end'},
      ],
    },{
      value: {          
        "Sat":{
          "tag": "周六",
          "key": [{'tag':'sat_morning'},{'tag':'sat_afternoon'},{'tag':'sat_evening'}]
        },
        "Sun": {
          "tag": "周日",
          "key": [{'tag':'sun_morning'},{'tag':'sun_afternoon'},{'tag':'sun_evening'}]
        }
      },   
    },{
      value: [
        {"tag":"数学"},
        {"tag":"语文"},
        {"tag":"英语"},
        {"tag":"物理"},
        {"tag":"化学"},
        {"tag":"生物"},
        {"tag":"奥数"},
        {"tag":"音乐"},
        {"tag":"美术"},
        {"tag":"全科"},
        {"tag":"其他"}
      ]
    },{
      value:[
        {"tag":"小学1年级"},
        {"tag":"小学2年级"},
        {"tag":"小学3年级"},
        {"tag":"小学4年级"},
        {"tag":"小学5年级"},
        {"tag":"小学6年级"},
        {"tag":"初中1年级"},
        {"tag":"初中2年级"},
        {"tag":"初中3年级"},
        {"tag":"高中1年级"},
        {"tag":"高中2年级"},
        {"tag":"高中3年级"},
        {"tag":"大学辅导"},
        {"tag":"成人辅导"}             
      ]
    }

    ],
  },
  computed: {
   isOtherMethod: function(){
    for(var i = 0,len = this.Arr.teacher_method_arr.length;i<len;i++){
      if(this.Arr.teacher_method_arr[i] == '其他'){
        return true;
      }
    }
    return false;
   },
   isOtherSubject: function(){
    for(var i = 0,len = this.Arr.subjectArr.length;i<len;i++){
      if(this.Arr.subjectArr[i] == '其他'){
        return true;
      }
    }
    return false;
   },

  },
  watch: {
    'Arr.gradeArr':function (res){
      if(res.length>1){
        this.form.grade = res.join(",");
      }else{
        this.form.grade = res[0];
      }
    },
    'Arr.subjectArr':function (res){
      if(res.length>1){
        this.form.subject= res.join(",");
      }else{
        this.form.subject = res[0];
      }
    },
    'Arr.teacher_method_arr':function (res){
      if(res.length>1){
        this.form.teacher_method= res.join(",");
      }else{
        this.form.teacher_method = res[0];
      }
    },   
  },
  ready: function(){
      this.getSignature();
      if(!this.getParam()){
        var self = this;
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(function(){
         self.onGetLocation();
        }, 300);
      }else{
        // this.status.getLocation = false;
        this.render();
        // this.getSignature();
      }
      // this.getSignature();
      this.status.isLoading = true;
  },
  methods: {
    getData:function(key){
      this.$http.post(this.domain+'/getText',{
        'key':[key]
      },{
        crossOrigin: true,
        headers:{
          'Content-Type':'application/json' 
        }
      }).then(function(res){
        console.log(res.json());
        if(res.json().success == 1){
          if(key == 'salary'){
            this.salary = res.json().salary;
          }else{
            this.notice = res.json().notice;
          }
        }else{
          console.log(res.json().error);
        }
      })
    },
    offHint: function(){
	    this.hintData.status = false;
    },
    getParam: function(){
      var str = location.search;
      if (str.indexOf("?") == -1) {       
        return 0;
      }
     else {
      return 1;
     }
    },
    render: function(){
      this.$http.post(this.domain+'/getTeacherInfo',{
        // "tea_id": '',
        "format": 0,
      },{
        crossOrigin: true,  
        headers:{
          'Content-Type':'application/json' 
        }      
      }).then(function(res){
        console.log(res.json());
        var data = res.json();
        delete data.tea_id;
        this.$set('form',data);
        var img1 = res.json().certificate_photo;
        if(img1!==''){
          this.images.certificate_photo = this.domain+img1;
        }
        var img2 = res.json().teach_show_photo;
        for(var i =0;i<3;i++){
          if(img2[i].img!=''){
            var img = img2[i].img;
            img2[i].img = this.domain+img;
          }
        }
        this.images.teach_show_photo = img2;
        this.form.salary_bottom=parseInt(res.json().salary_bottom);
        this.form.salary_top = parseInt(res.json().salary_top);
        var subject = this.form.subject,
            grade = this.form.grade,
            method = this.form.teacher_method,
            mon = this.form.mon_end,
            tues = this.form.tues_end,
            wed = this.form.wed_end,
            thur = this.form.thur_end,
            fri = this.form.fri_end;
            

        if(subject!==null && subject!==''){
          this.getArr(subject,'subjectArr');         
        }
        if(grade!==null&&grade!==''){
          this.getArr(grade,'gradeArr');
        }
        if(method!==null&&method!==''){
          this.getArr(method,'teacher_method_arr');
        }
        if(mon!==null&&mon!==''){
          this.getTimePeriod('mon_begin',mon,'Mon');
        }
        if(tues!==null&&tues!==''){
          this.getTimePeriod('tues_begin',tues,'Tue');
        }
        if(wed!==null&&wed!==''){
          this.getTimePeriod('wed_begin',wed,'Wed');
        }
        if(thur!==null&&thur!==''){
          this.getTimePeriod('thur_begin',thur,'Thr');
        }
        if(fri!==null&&fri!==''){
          this.getTimePeriod('fri_begin',fri,'Fri');
        }
      })
    },
    getArr: function(sub,subArr){
        if(sub.indexOf(",") == -1){
          this.Arr[subArr].push(sub);
        }else{
         this.Arr[subArr]=sub.split(","); 
        }
    },
    getTimePeriod: function(begin,end,arr){
       for(var i = this.form[begin];i<=end;i++){
         this.time[arr].push(i);
       }
    },
    
    addInput:function(){
      var obj = {key:''};
      this.form.score_other.push(obj);
    },
    onWeekday:function(day,index,begin,end){          
     var time = this.time,
         form = this.form;
      if(time[day].length==0){
      //第一次点
        form[begin]=index; 
        form[end]=index;  
      }               
      if(time[day].length>=1){
       if(index> form[end]){
          form[end] = index;  
          time[day] = [];
          for(var i =  form[begin];i<form[end];i++){
            time[day].push(i);
          }       
        }else if(index> form[begin]&&index<form[end]){
          form[end] = index;  
          time[day] = [];
          for(var i =  form[begin];i<form[end];i++){
            time[day].push(i);
          }       
        }
        else if(index == form[begin]){
          form[end] =  form[begin];
          time[day] = [];
          for(var i =  form[begin];i<=form[end];i++){
            time[day].push(i);
          }
          form[begin]='';
          form[end]='';
        }
        else if(index< form[begin]&& form[begin]< form[end]){
          form[begin] = index;   
          time[day] = [];
          for(var i =form[begin]+1;i<= form[end];i++){
            time[day].push(i);
          } 
        } 
      }
    },
    zero: function(n){
      return n < 10 ? '0' + n : n;
    },
    onSubmit: function(){
      var getParam = this.getParam(),
          self = this,
          keyword;
      if(getParam == 0){
        keyword = '/createTeacher';
      }else{
        keyword = '/updateTeacher';
      }
     if(!(/^1[34578]\d{9}$/.test(this.form.tel))){
      this.hintData.status = true;
      this.hintData.text = "请填写正确的手机号码";
      return false;
     }else{
      this.hintData.text = '';
      this.status.isSubmit = true;
      self.onSubmitPost(keyword);   
     }

    },
    onSubmitPost: function(keyword){
      var self = this,url;
      this.$http.post(this.domain+keyword, this.form,{
        crossOrigin: true,
        headers:{
          'Content-Type':'application/json' 
        }
      }).then(function(res) {
        this.status.isSubmit = false;
        console.log(res.json());
        if (res.json().success == 1) {
          this.hintData.text = '成功提交，请耐心等待审核';
          this.hintData.status = true;
          if(keyword == '/createTeacher')
          {
            this.getData('notice');
            this.timer && clearTimeout(this.timer);
            this.timer=setTimeout(function(){
               self.hintData.status = false;
               self.status.isNotice = true;
            },1000);           
          }else{
            url = './teacherMyPage.html';
            this.timer && clearTimeout(this.timer);
            this.timer=setTimeout(function(){
               self.hintData.status = false;
               location.href = url;
            },2000);
          } 
        } else {
          this.hintData.text = res.json().error;
          this.hintData.status = true;
          this.timer && clearTimeout(this.timer);
          this.timer=setTimeout(function(){
             self.hintData.status = false;
          },2000);
        }
      });
    },
    onNotice: function(){
      location.href = 'teacherPage.html';
    },
    uploadImg: function(index){
      var img = this.images;
      var self = this;
      wx.ready(function(){
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            console.log(res);
            var localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片          
            if(index == 'certificate_photo'){
              img.certificate_photo = localId;
            }else{
              img.teach_show_photo[index].img = localId;
            }
            self.uploadImgTo(localId,index);
          }
        });
      })
    },
    uploadImgTo: function(id,index){
      var img = this.form;
      var serverId,self = this;
      wx.uploadImage({
        localId: id, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
          serverId = res.serverId;
          if(index == 'certificate_photo'){
            img.certificate_photo = serverId;
          }else{
            img.teach_show_photo[index].img = serverId;
          }  
        }
      });
       
    },
    
    onClosePrice: function(){
      this.status.isPrice = false;
    },
    onCloseNotice: function(){
      this.status.isNotice = false;
    },
    onSalary: function(){
      this.getData('salary');
      this.status.isPrice = true;
    },
    getSignature: function(){        
      this.$http.post(this.domain+'/generate_signature',{
        timestamp: 1482652615,
        nonceStr: 'yinzishao',
      },{
        crossOrigin: true,
        headers:{
          'Content-Type':'application/json' 
        }
      }).then(function(res){
        console.log(res.json());
        this.signature = res.json().signature;
        var self = this;
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: 'wx7a327445ac3309b4', // 必填，公众号的唯一标识
          timestamp: 1482652615, // 必填，生成签名的时间戳
          nonceStr:'yinzishao' , // 必填，生成签名的随机串
          signature: self.signature,// 必填，签名，见附录1
          jsApiList: ['checkJsApi','openLocation','getLocation','chooseImage','uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
      })                
    },
    onGetLocation: function(){
      var self = this;
      wx.ready(function(){
      //地理位置
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            self.location.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            self.location.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            self.onAllow();
          },
        });
      });
    },
    //发送定位
    onAllow: function(){
      this.$http.post(this.domain+'/setLocations',this.location,{
        crossOrigin: true,
        headers:{
          'Content-Type':'application/json' 
        }
      }).then(function(res){
        if(res.json().success == 1){
          // this.status.getLocation = false;
        }
      })
    },
  },
});
	
})();