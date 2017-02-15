(function(){
	Vue.http.interceptors.push(function(request, next){
	    request.credentials = true;
	    next();
	});
	var vm = new Vue({
		el: 'body',
		data:{
			timer: null,
			domain: 'http://www.yinzishao.cn:8000',
			status:{
                isTutorInfo: false,
                isSuccess: '',
                isDefault: '',
                isInfoTipOne: false,
                selected: '',
                isRegister: '',
                isLoading: false,
                errorTip:'对不起，您只能选择一位老师',
                isTutor: true,
                isNoTutor: false
			},
			recommendList:[
               // {tea_id: 1,certificate_photo:'../img/user02.png',name:'张老师',isInvited:'已邀请',subject:'数学',subject_other:'',grade:'高一',distance:0.6,native_place:"天河",time:"周六上午",place:"家长家",teacher_method:"nice,细心",teacher_method_other: '',expection:"上课要耐心细致",sex:'男',salary_bottom:20,salary_top:60,campus_major:'数学',score:'学习成绩进步很大',self_comment:'特别受学生喜欢',teach_show_photo:[]},
               // {tea_id: 1,certificate_photo:'../img/user02.png',name:'张老师',isInvited:'已报名',subject:'数学',subject_other:'',grade:'高一',distance:0.6,native_place:"天河",time:"周六上午",place:"家长家",teacher_method:"nice,细心",teacher_method_other: '',expection:"上课要耐心细致",sex:'男',salary_bottom:20,salary_top:60,campus_major:'数学',score:'学习成绩进步很大',self_comment:'特别受学生喜欢',teach_show_photo:[]},
               // {tea_id: 1,certificate_photo:'../img/user02.png',name:'张老师',isInvited:'已拒绝',subject:'数学',subject_other:'',grade:'高一',distance:0.6,native_place:"天河",time:"周六上午",place:"家长家",teacher_method:"nice,细心",teacher_method_other: '',expection:"上课要耐心细致",sex:'男',salary_bottom:20,salary_top:60,campus_major:'数学',score:'学习成绩进步很大',self_comment:'特别受学生喜欢',teach_show_photo:[]},
               // {tea_id: 1,certificate_photo:'../img/user02.png',name:'张老师',isInvited:'已完成',subject:'数学',subject_other:'',grade:'高一',distance:0.6,native_place:"天河",time:"周六上午",place:"家长家",teacher_method:"nice,细心",teacher_method_other: '',expection:"上课要耐心细致",sex:'男',salary_bottom:20,salary_top:60,campus_major:'数学',score:'学习成绩进步很大',self_comment:'特别受学生喜欢',teach_show_photo:[]},
               // {tea_id: 1,certificate_photo:'../img/user02.png',name:'张老师',isInvited:'',subject:'数学',subject_other:'',grade:'高一',distance:0.6,native_place:"天河",time:"周六上午",place:"家长家",teacher_method:"nice,细心",teacher_method_other: '',expection:"上课要耐心细致",sex:'男',salary_bottom:20,salary_top:60,campus_major:'数学',score:'学习成绩进步很大',self_comment:'特别受学生喜欢',teach_show_photo:[]},
               // {tea_id: 1,certificate_photo:'../img/user02.png',name:'张老师',isInvited:'',subject:'数学',subject_other:'',grade:'高一',distance:0.6,native_place:"天河",time:"周六上午",place:"家长家",teacher_method:"nice,细心",teacher_method_other: '',expection:"上课要耐心细致",sex:'男',salary_bottom:20,salary_top:60,campus_major:'数学',score:'学习成绩进步很大',self_comment:'特别受学生喜欢',teach_show_photo:[]},
               // {tea_id: 1,certificate_photo:'../img/user02.png',name:'张老师',isInvited:'',subject:'数学',subject_other:'',grade:'高一',distance:0.6,native_place:"天河",time:"周六上午",place:"家长家",teacher_method:"nice,细心",teacher_method_other: '',expection:"上课要耐心细致",sex:'男',salary_bottom:20,salary_top:60,campus_major:'数学',score:'学习成绩进步很大',self_comment:'特别受学生喜欢',teach_show_photo:[]},
               
			],
			detailedList:[],
			formGroup: [{
              value: [
                {"tag":"科目"},
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
                {"tag":"年级",},
                {"tag":"小学1年级",},
                {"tag":"小学2年级",},
                {"tag":"小学3年级",},
                {"tag":"小学4年级",},
                {"tag":"小学5年级",},
                {"tag":"小学6年级",},
                {"tag":"初中1年级",},
                {"tag":"初中2年级",},
                {"tag":"初中3年级",},
                {"tag":"高中1年级",},
                {"tag":"高中2年级",},
                {"tag":"高中3年级",}              
              ]
			},{
			  value:[
			    {"tag":"年级",},
                {"tag":"大学辅导",},
                {"tag":"成人辅导",}
			  ]
			},{
			  value:[
                {"tag":"最热门",'key':1},
                {"tag":"最新",'key':2}
			  ]
			}],
            grade: [
                {"tag":"年级",},
                {"tag":"小学1年级",},
                {"tag":"小学2年级",},
                {"tag":"小学3年级",},
                {"tag":"小学4年级",},
                {"tag":"小学5年级",},
                {"tag":"小学6年级",},
                {"tag":"初中1年级",},
                {"tag":"初中2年级",},
                {"tag":"初中3年级",},
                {"tag":"高中1年级",},
                {"tag":"高中2年级",},
                {"tag":"高中3年级",}               
			],
			swipeinfo:[],
            mySwipe: {},
            slideNum: {},
            jsonData:[],
            change:{
              subject:'科目',
              grade: '年级',
            },
			form: {
			  'size':6,
			  'start':0,
			  'subject':'',
			  'grade': '',
			  'hot': 1
			}
		},
		watch: {
          'change.subject':function(){
          	this.onSelect();
          },
		},
		ready: function(){
			this.getImg();
			this.renderData();
		},
		methods:{
			getImg: function(){
	        	this.$http.post(this.domain+'/getText',{
	        		'key':['getImg']
	        	},{
	        		crossOrigin: true,
	        		headers:{
	                  'Content-Type':'application/json' 
	                }
	        	}).then(function(res) {
	        		console.log(res.json());
	        		if(res.json().success == 1){
	        			var data = res.json().getImg;
	        			for(var i = 0;i<data.length;i++){
	        				var img = data[i].img;
	        				data[i].img = this.domain+img;	
	        				if(data[i].url==''||data[i].url==null){
	        					data[i].url = '#';
	        				}        				
	        			}
	        			this.$set('swipeinfo', data);
	        			//等dom更新之后才执行
	        			this.$nextTick(function(){
	        				this.getSwipe();
	        			})
	        			console.log(this.swipeinfo.length)
	        		}else{
	        			console.log(res.json().error);
	        		}				
				});
	        },
			down: function(){
              this.form.start++;
              if(this.jsonData.length!==0){
	            this.renderData();
	          }
			},
			getSwipe: function(){
				console.log(this.swipeinfo);
	    		var self = this;
		        //获取子组件中分页小圈圈
		        var slides = self.$els.swipe.getElementsByClassName('swipe-pagination-switch');
		        self.mySwipe = new Swipe(self.$els.swipe, {
		            startSlide: 0,
		            continuous: true,
		            speed: 1000,
		            auto: 1000,
		            stopPropagation: false,
		            callback: function(index, elem) {
		                //渲染分页小圈圈
		                for (var i = 0; i < slides.length; i++) {
		                    if (i != index) {
		                        slides[i].style.opacity = "0.2";
		                        slides[i].style.background = "#333";
		                    } else {
		                        slides[index].style.opacity = "1";
		                        slides[index].style.background = "#fff";
		                    }
		                }
		            },
		        });
		        self.slideNum = self.mySwipe.getNumSlides() - 1;
	    	},
	    	//点击底部小圈圈，跳到其所对应页
	        slideToCur: function(index) {
	            var self = this;
	            self.mySwipe.slide(index, 300);
	        },
	        renderData: function(){	        	        	
				this.$http.post(this.domain+'/getTeachers',this.form,{
	               crossOrigin: true,
	               headers:{
	                  'Content-Type':'application/json' 
	               }
	            }).then(function(res){
	              console.log(res.json());
	              if(res.json().success == 0){
	              	console.log(res.json().error);
	              }else{
	              	this.jsonData = res.json();
	              	var data = res.json();
	              	if(data.length!=0){
	              		this.status.isNoTutor = false;
				        this.status.isTutor = true;
	              		for(var i = 0;i<data.length;i++){
		              		if(data[i].certificate_photo!=''){
		              			data[i].certificate_photo = this.domain+data[i].certificate_photo;
		              		}else{
		              			data[i].certificate_photo = '../img/user02.png';
		              		}
		              		var teach_photo=data[i].teach_show_photo,len=data[i].teach_show_photo.length;
		              		if(len!=0){
		              			for(var j=0;j<len;j++){
		                           teach_photo[j]=this.domain+teach_photo[j];
			              		}
		              		}
		              	}
		              	var json=this.recommendList.concat(data);
		                this.$set('recommendList',json);
	              	}else{
	              		if(this.recommendList.length == 0){
	              		  this.status.isNoTutor = true;
				          this.status.isTutor = false;
	              		}
	              	}     	
	              }	             
	            })
	        },	       
			onRecommend:function(){
				window.location.href='./parentPage.html';
			},
			onMine: function(){
				window.location.href = './parentMyPage.html';
			},
			onAllTutor: function(){
				this.status.isTutorInfo = false;
			},
			onTutorInfo: function(index){
				this.status.isTutorInfo = true;
				this.status.selected = index; 
				this.detailedList = this.recommendList[index];
				if(this.recommendList[index].isInvited=="已邀请"){
					this.status.isDefault = true;
	                this.status.isSuccess = false;
	                this.status.isRegister = "取消邀请";
				}else if(this.recommendList[index].isInvited == "已报名"){
					this.status.isDefault = false;
	              	this.status.isSuccess = true;
					this.status.isRegister = "该老师已报名";
				}else if(this.recommendList[index].isInvited == "已拒绝"){
					this.status.isDefault = true;
	              	this.status.isSuccess = false;
					this.status.isRegister = "该老师已拒绝";
				}else if(this.recommendList[index].isInvited == "已完成"){
					this.status.isDefault = false;
	              	this.status.isSuccess = true;
					this.status.isRegister = "双方已成交";
				}
				else{					               
	              	this.status.isDefault = false;
	              	this.status.isSuccess = true;
	              	this.status.isRegister = "邀请老师";
				}

			},
			onRegister1: function(index){
				//邀请老师、取消邀请
				var invited,invitedText,successText;
				if(this.status.isRegister == "邀请老师"){
					invited = 1;
                    invitedText = '已邀请';
                    successText='邀请成功';
				}
				else if(this.status.isRegister == "取消邀请"){
					invited = 0;
                    invitedText = '';
                    successText='取消成功';
				}else{
					return false;
				}
				this.$http.post(this.domain+'/inviteTeacher',{
					'tea_id': this.recommendList[index].tea_id,
					'type': invited
				},{
					crossOrigin: true,
					headers:{
						'Content-Type':'application/json'	
					}

				}).then(function(res){
					console.log(res.json());
					if(res.json().success==1){
				       this.status.isRegister =successText;
		                var self = this;
		                this.timer && clearTimeout(this.timer);
		                this.timer = setTimeout(function(){
		                 self.recommendList[index].isInvited = invitedText;
				         self.status.isTutorInfo = false;
		                }, 1500);
					}else{
						console.log(res.json().error);
						var self = this;
						this.status.errorTip = res.json().error;
						this.status.isTutorInfo = false;
						this.status.isInfoTipOne = true;
						this.timer && clearTimeout(this.timer);
						this.timer=setTimeout(function(){
                           self.status.isInfoTipOne = false;
						},2000);
					}
					
				})
			},
			onClose: function(){
	      		this.status.isTutorInfo = false;
	      	},
	      	onSelect:function(){
	      		if(this.change.subject=="其他"){
	      			this.grade = this.formGroup[2].value;
	      			this.change.grade = '年级';
	      			this.form.grade='';
	      		}else{
	      			this.grade = this.formGroup[1].value;
	      			this.change.grade = '年级';
	      			this.form.grade = '';
	      		}
	      		
	      		if(this.change.subject!=='科目'){
	      			this.form.subject = this.change.subject;
	      		}else{
	      			this.form.subject = '';
	      		}
	      		this.form.start = 0;
	      		this.recommendList = [];
                this.renderData();
                
	      	},
	      	onSelectGrade: function(){
                if(this.change.grade!=='年级'){
	      			this.form.grade = this.change.grade;
	      		}else{
	      			this.form.grade = '';
	      		}
	      		this.onSelectChange();
	      	},
	      	onSelectChange: function(){
	      		this.form.start = 0;
	      		this.recommendList = [];
	      		this.renderData();
	      	},
	      	
		}
	})
})();