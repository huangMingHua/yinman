module.exports = app => {
  class wechat extends app.Service {
    *
        bookingSuccess(studentName, courseName, now, publicOpenId, studentId) {
          const data = {
            first: {
              value: studentName + '的家长，您的预约试课申请已提交',
              color: '#173177',
            },
            keyword1: {
              value: courseName,
              color: '#173177',
            },
            keyword2: {
              value: now,
              color: '#173177',
            },
            remark: {
              value: '请等待后续预约审核通知。点击查看详情！',
              color: '#173177',
            },
          };
          if (publicOpenId) {
            template('NI1hJJe3VGtw68_rDBTuQyY6m1aPWBg08ejAhSEcK6Y', {
              appid: 'wxdc06b91aef63b7b4',
              pagepath: `pages/student/bookingRecord/bookingRecord?studentId=${studentId}`,
            }, data, publicOpenId);
          }

        } * bookingSuccessAdmin(courseName, now, publicOpenId) {
          const data = {
            first: {
              value: '您有新的预约试课申请，请尽快登录系统后台审核！',
              color: '#173177',
            },
            keyword1: {
              value: courseName,
              color: '#173177',
            },
            keyword2: {
              value: now,
              color: '#173177',
            },
          };
          if (publicOpenId) {
            template('NI1hJJe3VGtw68_rDBTuQyY6m1aPWBg08ejAhSEcK6Y', '', data, publicOpenId);
          }

        }

    *
        bookingAuditingSuccess(firstNumber, studentName, courseName, className, teacherName, classTime, publicOpenId, studentId, teacherPublicOpenId) {
          let firstValue;
          if (firstNumber == 1) {
            firstValue = studentName + '的家长，您预约的音曼音乐课堂' + courseName + '试听课已申请成功，请按以下信息参加试听！';
          } else {
            firstValue = `${studentName}的家长，您预约的音曼音乐课堂${courseName}试听课时间已更改，请按以下信息参加试听！`;
          }
          const data = {
            first: {
              value: firstValue,
              color: '#173177',
            },
            keyword1: {
              value: studentName,
              color: '#173177',
            },
            keyword2: {
              value: courseName,
              color: '#173177',
            },
            keyword3: {
              value: className,
              color: '#173177',
            },
            keyword4: {
              value: teacherName,
              color: '#173177',
            },
            keyword5: {
              value: classTime,
              color: '#173177',
            },
            remark: {
              value: `试听地址：上海浦东新区上南路3899弄35号02
联系电话：13524160481 , 13564281815
注意事项：待定。查看课程详情！`,
              color: '#173177',
            },
          };
          if (publicOpenId) {
            template('npqqtfrsNF1DMMOVHSYHwIyuq1gZXCwU9_vNHlKLCsU', {
              appid: 'wxdc06b91aef63b7b4',
              pagepath: `pages/student/bookingRecord/bookingRecord?studentId=${studentId}`,
            }, data, publicOpenId);
          }

          const data1 = {
            first: {
              value: `${teacherName}老师，您有新的预约试课申请，信息如下：`,
              color: '#173177',
            },
            keyword1: {
              value: studentName,
              color: '#173177',
            },
            keyword2: {
              value: courseName,
              color: '#173177',
            },
            keyword3: {
              value: className,
              color: '#173177',
            },
            keyword4: {
              value: teacherName,
              color: '#173177',
            },
            keyword5: {
              value: classTime,
              color: '#173177',
            },
            remark: {
              value: '请提前做好准备按时上课！',
              color: '#173177',
            },
          };
          if (teacherPublicOpenId) {
            template('npqqtfrsNF1DMMOVHSYHwIyuq1gZXCwU9_vNHlKLCsU', '', data1, teacherPublicOpenId);
          }
        } *
            bookingAuditingFail(studentName, courseName, classTime, publicOpenId, studentId) {
              const data = {
                first: {
                  value: studentName + '的家长，您预约的音曼音乐课堂' + courseName + '试听课已被婉拒:',
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: classTime,
                  color: '#173177',
                },
                keyword3: {
                  value: '上海浦东新区上南路3899弄35号02',
                  color: '#173177',
                },
                remark: {
                  value: '如有需要可重新预约，点击查看！',
                  color: '#173177',
                },
              };
              if (publicOpenId) {
                template('gjX3uqQXguVZm1GcQ1GLlLo-zfiVg7Ff5msMBINf--M', {
                  appid: 'wxdc06b91aef63b7b4',
                  pagepath: `pages/student/bookingRecord/bookingRecord?studentId=${studentId}`,
                }, data, publicOpenId);
              }

            } *
            bookingstartCancel1(studentName, courseName, classTime, publicOpenId, studentId) {
              const data = {
                first: {
                  value: studentName + '的家长，您的音曼音乐课堂试课申请已取消成功',
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: classTime,
                  color: '#173177',
                },
                keyword3: {
                  value: '上海浦东新区上南路3899弄35号02',
                  color: '#173177',
                },
                remark: {
                  value: '如有需要可重新预约，点击查看！',
                  color: '#173177',
                },
              };
              if (publicOpenId) {
                template('SRzfVUQiSMIxNP-YpJALPYvOjWq1aaMfxJndQjrHKzI', {
                  appid: 'wxdc06b91aef63b7b4',
                  pagepath: `pages/student/bookingRecord/bookingRecord?studentId=${studentId}`,
                }, data, publicOpenId);
              }
            } *
            bookingEndCancel(studentName, courseName, classTime, publicOpenId, studentId, teacherPublicOpenId, teacherName) {
              const data = {
                first: {
                  value: studentName + '的家长，您的音曼音乐课堂试课申请已取消成功',
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: classTime,
                  color: '#173177',
                },
                keyword3: {
                  value: '上海浦东新区上南路3899弄35号02',
                  color: '#173177',
                },
                remark: {
                  value: '如有需要可重新预约，点击查看！',
                  color: '#173177',
                },
              };
              if (publicOpenId) {
                template('SRzfVUQiSMIxNP-YpJALPYvOjWq1aaMfxJndQjrHKzI', {
                  appid: 'wxdc06b91aef63b7b4',
                  pagepath: `pages/student/bookingRecord/bookingRecord?studentId=${studentId}`,
                }, data, publicOpenId);
              }

              const data2 = {
                first: {
                  value: `${teacherName}老师，${studentName}学生的预约试课申请已取消。`,
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: classTime,
                  color: '#173177',
                },
                keyword3: {
                  value: '上海浦东新区上南路3899弄35号02',
                  color: '#173177',
                },
              };
              if (teacherPublicOpenId) {
                template('SRzfVUQiSMIxNP-YpJALPYvOjWq1aaMfxJndQjrHKzI', '', data2, teacherPublicOpenId);
              }
            } * bookingEndCancelAdmin(studentName, courseName, classTime, adminPublicOpenId) {
              const data1 = {
                first: {
                  value: studentName + '学生的预约试课申请已取消',
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: classTime,
                  color: '#173177',
                },
                keyword3: {
                  value: '上海浦东新区上南路3899弄35号02',
                  color: '#173177',
                },
              };
              if (adminPublicOpenId) {
                template('SRzfVUQiSMIxNP-YpJALPYvOjWq1aaMfxJndQjrHKzI', '', data1, adminPublicOpenId);
              }
            } *
            sendBerforOneDayForbooking() {
              const list = yield this.ctx.service.bookingWechat.getListByIsSend();
              for (const item of list) {
                console.log(111);
                const sendTime = new Date(item.sendTime);
                const now = new Date();
                if (now.getTime() >= sendTime) {
                  const bookingCourse = yield this.ctx.service.bookingCourse.getById(item.bookingCourseId);
                  if (!bookingCourse) {
                    continue;
                  }
                  let courseTableItem;
                  if (bookingCourse.confirmedId) {
                    courseTableItem = yield this.ctx.service.courseTableItem.getById(bookingCourse.confirmedId);
                  } else {
                    courseTableItem = yield this.ctx.service.courseTableItem.getById(bookingCourse.courseTableItemId);
                  }
                  const classTime = app.moment(courseTableItem.date).format('YYYY.MM.DD') + ' ' + courseTableItem.startTime + '-' + courseTableItem.endTime;
                  const student = yield this.ctx.service.student.getById(bookingCourse.studentId);
                  const user = yield this.ctx.service.user.getById(student.userId);
                  const data = {
                    first: {
                      value: '您预约的音曼音乐课堂试听课程还有1天开课啦，请做好准备，提前15分钟到达',
                      color: '#173177',
                    },
                    keyword1: {
                      value: courseTableItem.courseName,
                      color: '#173177',
                    },
                    keyword2: {
                      value: classTime,
                      color: '#173177',
                    },
                    keyword3: {
                      value: '上海浦东新区上南路3899弄35号02',
                      color: '#173177',
                    },
                    remark: {
                      value: '查看课程详情！',
                      color: '#173177',
                    },
                  };
                  if (user && user.publicOpenId) {
                    template('r8oRIy97IfoMdKfMypH6IN5HKb_6ypJn_tl8NpL7wAY', {
                      appid: 'wxdc06b91aef63b7b4',
                      pagepath: `pages/index/class/appointmentList/studentReservationInformation/studentReservationInformation?_id=${bookingCourse.id}`,
                    }, data, user.publicOpenId);
                  }
                  item.isSend = 1;
                  yield this.ctx.service.bookingWechat.update(item);
                }
              }
            } *
            signUpSuccess(studentName, courseName, classTime, publicOpenId, studentId) {
              console.log('学生id', studentId);
              const data = {
                first: {
                  value: studentName + '的家长，您已成功预报名音曼音乐课堂课程:',
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: classTime,
                  color: '#173177',
                },
                keyword3: {
                  value: '上海浦东新区上南路3899弄35号02。电话：13524160481 , 13564281815',
                  color: '#173177',
                },
                remark: {
                  value: '请于报名后48小时内付费，则可保留时间、名额，过期则需重新报名。查看课程详情！',
                  color: '#ff0000',
                },
              };
              if (publicOpenId) {
                template('oYN1SQt6mPcH5ZTfHX_-o653WtOxBmsusIBGRVO3gII', {
                  appid: 'wxdc06b91aef63b7b4',
                  pagepath: `pages/student/registrationRecord/registrationRecord?studentId=${studentId}`,
                }, data, publicOpenId);
              }
            } *
            signUpSuccessAdmin(courseName, studentName, address, signUpTime, adminPublicOpenId, telephone) {
              const data = {
                first: {
                  value: '您有新的学生报名，信息如下：',
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: studentName,
                  color: '#173177',
                },
                keyword3: {
                  value: telephone,
                  color: '#173177',
                },
                keyword4: {
                  value: address,
                  color: '#173177',
                },
                keyword5: {
                  value: signUpTime,
                  color: '#173177',
                },
                remark: {
                  value: '报名详情可登录系统后台查看！',
                  color: '#173177',
                },
              };
              if (adminPublicOpenId) {
                template('tJHrN0qvo0BAi3ewd5vV_sDxQZtdcBeGaZhk_rLaqzM', '', data, adminPublicOpenId);
              }
            } *
            signUpAuditingSuccess(studentName, teacherName, courseName, classTime, classroomName, publicOpenId, teacherPublicOpenId, studentId) {
              const data = {
                first: {
                  value: `${studentName}的家长，您已成功报名音曼音乐课堂${teacherName}的课程：`,
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: classTime,
                  color: '#173177',
                },
                keyword3: {
                  value: `上海浦东新区上南路3899弄35号02。教室：${classroomName}`,
                  color: '#173177',
                },
                remark: {
                  value: '请于课程开始时准时报到！联系电话：13524160481 , 13564281815。查看课程详情！',
                  color: '#173177',
                },
              };
              if (publicOpenId) {
                template('zAcGjEXEroZ589XSlkxN7Zy48qOoESPTxYSun_G9nzM', {
                  appid: 'wxdc06b91aef63b7b4',
                  pagepath: `pages/student/myCourse/myCourse?studentId=${studentId}`,
                }, data, publicOpenId);
              }
              const data1 = {
                first: {
                  value: `${teacherName}教师，恭喜您有新的学员${studentName}加入，以下是您的课程安排：`,
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: classTime,
                  color: '#173177',
                },
                keyword3: {
                  value: `${classroomName}教室`,
                  color: '#173177',
                },
                remark: {
                  value: '请您提前做好课程准备，谢谢！',
                  color: '#173177',
                },
              };
              if (teacherPublicOpenId) {
                template('oYN1SQt6mPcH5ZTfHX_-o653WtOxBmsusIBGRVO3gII', '', data1, teacherPublicOpenId);
              }
            } *
            signUpAuditingFail(studentName, courseName, classTime, publicOpenId, studentId) {
              const data = {
                first: {
                  value: `${studentName}的家长，您预报名的音曼音乐课堂课程已被婉拒：`,
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: classTime,
                  color: '#173177',
                },
                keyword3: {
                  value: '上海浦东新区上南路3899弄35号02。',
                  color: '#173177',
                },
                remark: {
                  value: '如有需要可重新报名，点击查看！',
                  color: '#173177',
                },
              };
              if (publicOpenId) {
                template('zAcGjEXEroZ589XSlkxN7Zy48qOoESPTxYSun_G9nzM', {
                  appid: 'wxdc06b91aef63b7b4',
                  pagepath: `pages/student/registrationRecord/registrationRecord?studentId=${studentId}`,
                }, data, publicOpenId);
              }
            } *
            signUpCacleFail(studentName, courseName, classTime, publicOpenId, studentId) {
              const data = {
                first: {
                  value: `${studentName}的家长，您已取消课程在线预报名申请`,
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: studentName,
                  color: '#173177',
                },
                keyword3: {
                  value: '用户取消',
                  color: '#173177',
                },
                keyword4: {
                  value: app.moment().format('YYYY.MM.DD HH:mm'),
                  color: '#173177',
                },
                remark: {
                  value: '如有需要可重新报名，点击查看！',
                  color: '#173177',
                },
              };
              if (publicOpenId) {
                template('vJfaSndI4rRmgqJBWtcPVelojuVptvjlZKvGgqAv6zI', {
                  appid: 'wxdc06b91aef63b7b4',
                  pagepath: `pages/student/registrationRecord/registrationRecord?studentId=${studentId}`,
                }, data, publicOpenId);
              }
            } *
            signUpCacleFailToAdmin(studentName, courseName, adminPublicOpenId) {

              const data1 = {
                first: {
                  value: `${studentName}学生的在线报名申请已取消`,
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: studentName,
                  color: '#173177',
                },
                keyword3: {
                  value: '用户取消',
                  color: '#173177',
                },
                keyword4: {
                  value: app.moment().format('YYYY.MM.DD HH:mm'),
                  color: '#173177',
                },
                remark: {
                  value: '可登录系统后台报名记录查看！',
                  color: '#173177',
                },
              };
              if (adminPublicOpenId) {
                template('vJfaSndI4rRmgqJBWtcPVelojuVptvjlZKvGgqAv6zI', '', data1, adminPublicOpenId);
              }
    } *
      sendForSignUp() {
      const list1 = yield this.ctx.service.signUpWechat.getListByIsSend(1);
      const list2 = yield this.ctx.service.signUpWechat.getListByIsSend(2);
      const list3 = yield this.ctx.service.signUpWechat.getListByIsSend(3);
      yield sendSignUp(this, list1);
      yield sendSignUp(this, list2);
      yield sendSignUp(this, list3);

      function* sendSignUp(This, list1) {
        for (const item of list1) {
          const now = new Date();
          const date = app.moment(now).diff(item.courseTableItem.date, 'days');
          if (date === 30) {
            yield sendInfo(4)
          }
          if (date === 15) {
            yield sendInfo(3)
          }
          if (date === 1) {
            yield sendInfo(2)
          }
          function* sendInfo(num) {
            const student = yield This.ctx.service.student.getById(item.courseTableDetailStudent.studentId);
            const user = yield This.ctx.service.user.getById(student.userId);
            const courseTableDetail = yield This.ctx.service.courseTableDetail.getById(item.courseTableDetailStudent.courseTableDetailId);
            const classTime = app.moment(item.courseTableItem.date).format('YYYY.MM.DD');
            const data = {
              userName: {
                value: `${student.name}的家长！${student.name}的课程还有${date}天结束：`,
                color: '#173177',
              },
              courseName: {
                value: courseTableDetail.courseName,
                color: '#173177',
              },
              date: {
                value: classTime,
                color: '#173177',
              },
              remark: {
                value: '请及时续报名以免课程时间被占，如已续费请忽略此消息！点击续费',
                color: '#173177',
              },
            };
            template('0Hu_Bk-ecwGXshpOvBpTL6zpoV_yZPE07JLeZ9s3GeI', {
              appid: 'wxdc06b91aef63b7b4',
              pagepath: `pages/student/registrationRecord/registrationRecord?studentId=${student.id}`,
            }, data, user.publicOpenId);
            const signUpWechat = {
              id: item.id,
              isSend: num,
              courseTableDetailStudentId: item.courseTableDetailStudentId,
            };
            yield This.ctx.service.signUpWechat.update(signUpWechat);
          }
          //   const date1 = new Date(app.moment(item.courseTableItem.date).subtract(day1, 'days'));
          //   if (now.getTime() >= date.getTime() && now.getTime() <= date1.getTime()) {
                
          //   } else {
          //     const signUpWechat = {
          //       id: item.id,
          //       isSend: num,
          //       courseTableDetailStudentId: item.courseTableDetailStudentId,
          //     };
          //     yield This.ctx.service.signUpWechat.update(signUpWechat);
          //   }
          // }
        }

      }
    }
            *
            sendForSignUp1() {
              const list0 = yield this.ctx.service.signUpWechat.getListByIsSend(0);
              yield sendSignUp(this, list0, 3, 1);

              function* sendSignUp(This, list1, day, num) {
                for (const item of list1) {
                  const now = new Date();
                  const date = new Date(app.moment(item.courseTableItem.date).subtract(day, 'days'));
                  if (now.getTime() >= date.getTime()) {
                    const student = yield This.ctx.service.student.getById(item.courseTableDetailStudent.studentId);
                    const user = yield This.ctx.service.user.getById(student.userId);
                    const courseTableDetail = yield This.ctx.service.courseTableDetail.getById(item.courseTableDetailStudent.courseTableDetailId);
                    const classTime = app.moment(item.courseTableItem.date).format('YYYY.MM.DD');
                    const data = {
                      userName: {
                        value: `${student.name}的家长`,
                        color: '#173177',
                      },
                      courseName: {
                        value: `${courseTableDetail.courseName}`,
                        color: '#173177',
                      },
                      date: {
                        value: `${classTime} ${item.courseTableItem.startTime}~${item.courseTableItem.endTime}`,
                        color: '#173177',
                      },
                      remark: {
                        value: '感谢您对音曼音乐课堂的支持！点击查看课程详情！',
                        color: '#173177',
                      },
                    };
                    template('ohfOd_TnLziNEfZ9BSSDJBw49k63X-8ymioyrnU6vKk', {
                      appid: 'wxdc06b91aef63b7b4',
                      pagepath: `pages/student/myCourse/myCourse?studentId=${student.id}`,
                    }, data, user.publicOpenId);
                    const signUpWechat = {
                      id: item.id,
                      isSend: num,
                      courseTableDetailStudentId: item.courseTableDetailStudentId,
                    };
                    yield This.ctx.service.signUpWechat.update(signUpWechat);
                  }
                }
              }

            } *
            changeClass(studentName, courseName, oldClassTime, newClassTime, reason, newTeacherName, oldTeacherName, newClassroom, publicOpenId, oldTeacherPublicOpenId, newTeacherPublicOpenId, studentId, oldUserId) {
              const data = {
                first: {
                  value: `${studentName}的家长，${studentName}的课程申请调课成功，请注意：`,
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: oldClassTime,
                  color: '#173177',
                },
                keyword3: {
                  value: newClassTime,
                  color: '#173177',
                },
                keyword4: {
                  value: reason,
                  color: '#173177',
                },
                remark: {
                  value: `补课信息如下：补课老师：${newTeacherName}，现教室：${newClassroom}。
请按补课时间准时上课，谢谢！查看补课记录！`,
                  color: '#173177',
                },
              };
              if (publicOpenId) {
                template('enQWSvDApbTOlpYSVhjIoivpMlIrTh8qTeIN4hh6qgA', {
                  appid: 'wxdc06b91aef63b7b4',
                  pagepath: `pages/student/myCourse/myLesson/myLesson?studentId=${studentId}`,
                }, data, publicOpenId);
              }
              const newClassTime1 = newClassTime.split(' ');
              const data1 = {
                first: {
                  value: `${newTeacherName}老师，您有一条新的${courseName}补课信息，请注意：`,
                  color: '#173177',
                },
                keyword1: {
                  value: newClassTime1[0],
                  color: '#173177',
                },
                keyword2: {
                  value: newClassTime1[1],
                  color: '#173177',
                },
                keyword3: {
                  value: newTeacherName,
                  color: '#173177',
                },
                remark: {
                  value: `补课教室：${newClassroom}，请按补课时间准时上课，谢谢！`,
                  color: '#173177',
                },
              };
              if (newTeacherPublicOpenId) {
                template('ZExrFLLyeIV_p9BKAAn5tkge4VvNkfq3OG-HxXAsdps', {
                  appid: 'wxdc06b91aef63b7b4',
                  pagepath: `pages/student/myCourse/myLesson/myLesson?userId=${oldUserId}`,
                }, data1, newTeacherPublicOpenId);
              }
              if (newTeacherPublicOpenId !== oldTeacherPublicOpenId) {
                const data2 = {
                  first: {
                    value: `${oldTeacherName}老师，您学生${studentName}的课程申请调课成功，请注意：`,
                    color: '#173177',
                  },
                  keyword1: {
                    value: courseName,
                    color: '#173177',
                  },
                  keyword2: {
                    value: oldClassTime,
                    color: '#173177',
                  },
                  keyword3: {
                    value: newClassTime,
                    color: '#173177',
                  },
                  keyword4: {
                    value: reason,
                    color: '#173177',
                  },
                  remark: {
                    value: `补课信息如下：补课老师：${newTeacherName}，现教室：${newClassroom}，请按补课时间准时上课，谢谢！`,
                    color: '#173177',
                  },
                };
                if (oldTeacherPublicOpenId) {
                  template('enQWSvDApbTOlpYSVhjIoivpMlIrTh8qTeIN4hh6qgA', '', data2, oldTeacherPublicOpenId);
                }
              }
            } *
            addStudentLeave(studentName, courseName, classTime, teacherName, reason, publicOpenId, teacherPublicOpenId, studentId,courseTableDetailId) {
              const data = {
                first: {
                  value: `${studentName}的家长，${studentName}的课程申请请假成功，请注意：`,
                  color: '#173177',
                },
                keyword1: {
                  value: studentName,
                  color: '#173177',
                },
                keyword2: {
                  value: courseName,
                  color: '#173177',
                },
                keyword3: {
                  value: classTime,
                  color: '#173177',
                },
                keyword4: {
                  value: teacherName,
                  color: '#173177',
                },
                keyword5: {
                  value: reason,
                  color: '#173177',
                },
                remark: {
                  value: '请提前申请补课。',
                  color: '#173177',
                },
              };
              if (publicOpenId) {
                template('pvw9gahMaaGSFknb0LY8QQyxZPc10uenS0uLQUIJqhM', {
                  appid: 'wxdc06b91aef63b7b4',
                  pagepath: `pages/student/myCourse/myLessonAndleave/myLessonAndleave?studentId=${studentId}&courseTableDetailId=${courseTableDetailId}`,
                }, data, publicOpenId);
              }
              const data1 = {
                first: {
                  value: `${teacherName}老师，您有学生已申请请假成功，请注意：`,
                  color: '#173177',
                },
                keyword1: {
                  value: studentName,
                  color: '#173177',
                },
                keyword2: {
                  value: courseName,
                  color: '#173177',
                },
                keyword3: {
                  value: classTime,
                  color: '#173177',
                },
                keyword4: {
                  value: teacherName,
                  color: '#173177',
                },
                keyword5: {
                  value: reason,
                  color: '#173177',
                },
              };
              if (teacherPublicOpenId) {
                template('pvw9gahMaaGSFknb0LY8QQyxZPc10uenS0uLQUIJqhM', '', data1, teacherPublicOpenId);
              }
            } *
            addMakeUp(studentName, classDate, classTime, teacherName, classroom, publicOpenId, teacherPublicOpenId, studentId, courseName,courseTableDetailId) {
              console.log(studentName, classDate, classTime, teacherName, classroom, publicOpenId, teacherPublicOpenId, 55555555555555);
              const data = {
                first: {
                  value: `${studentName}的家长，${studentName}的补课申请已成功，请注意：`,
                  color: '#173177',
                },
                keyword1: {
                  value: classDate,
                  color: '#173177',
                },
                keyword2: {
                  value: classTime,
                  color: '#173177',
                },
                keyword3: {
                  value: teacherName,
                  color: '#173177',
                },
                remark: {
                  value: '补课教室：' + classroom.name + ',请按补课时间准时上课，谢谢！',
                  color: '#173177',
                },
              };
              if (publicOpenId) {
                template('Zce1-kEN_IEZIeqBtMSUkaOSix7fJ34zcA_9ITV_ps0', {
                  appid: 'wxdc06b91aef63b7b4',
                  pagepath: `pages/student/myCourse/myLessonAndleave/myLessonAndleave?studentId=${studentId}&courseTableDetailId=${courseTableDetailId}`,
                }, data, publicOpenId);
              }
              const data1 = {
                first: {
                  value: `${teacherName}老师，您有一条新的${courseName}补课信息，请注意：`,
                  color: '#173177',
                },
                keyword1: {
                  value: classDate,
                  color: '#173177',
                },
                keyword2: {
                  value: classTime,
                  color: '#173177',
                },
                keyword3: {
                  value: teacherName,
                  color: '#173177',
                },
                remark: {
                  value: '补课教室：' + classroom.name + ',请按补课时间准时上课，谢谢！',
                  color: '#173177',
                },
              };
              if (teacherPublicOpenId) {
                template('Zce1-kEN_IEZIeqBtMSUkaOSix7fJ34zcA_9ITV_ps0', '', data1, teacherPublicOpenId);
              }
            } *
            teacherChageClass(studentName, oldTeacherName, courseName, oldClassTime, newClassTime, reason, newTeacherName, classroom, publicOpenId, oldTeacherPublicOpenId, newTeacherPublicOpenId, studentId) {
              const data = {
                first: {
                  value: `${studentName}的家长，您好！${studentName}的课程由${oldTeacherName}老师发起调课，请注意：`,
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: oldClassTime,
                  color: '#173177',
                },
                keyword3: {
                  value: newClassTime,
                  color: '#173177',
                },
                keyword4: {
                  value: reason,
                  color: '#173177',
                },
                remark: {
                  value: `补课信息如下：补课老师：${newTeacherName}，现教室：${classroom}，请按补课时间准时上课，谢谢！ `,
                  color: '#173177',
                },
              };
              if (publicOpenId) {
                template('enQWSvDApbTOlpYSVhjIoivpMlIrTh8qTeIN4hh6qgA', {
                  appid: 'wxdc06b91aef63b7b4',
                  pagepath: `pages/student/myCourse/myLesson/myLesson?studentId=${studentId}`,
                }, data, publicOpenId);
              }

              const data1 = {
                first: {
                  value: `${oldTeacherName}老师，您的课程已调课成功：`,
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: oldClassTime,
                  color: '#173177',
                },
                keyword3: {
                  value: newClassTime,
                  color: '#173177',
                },
                keyword4: {
                  value: reason,
                  color: '#173177',
                },
                remark: {
                  value: `补课信息如下：补课老师：${newTeacherName}，现教室：${classroom}，请按补课时间准时上课，谢谢！
查看调课记录！`,
                  color: '#173177',
                },
              };
              if (oldTeacherPublicOpenId) {
                template('enQWSvDApbTOlpYSVhjIoivpMlIrTh8qTeIN4hh6qgA', '', data1, oldTeacherPublicOpenId);
              }
              if (newTeacherPublicOpenId !== oldTeacherPublicOpenId) {
                const data1 = {
                  first: {
                    value: `${newTeacherName}老师，您的课程已调课成功：`,
                    color: '#173177',
                  },
                  keyword1: {
                    value: courseName,
                    color: '#173177',
                  },
                  keyword2: {
                    value: oldClassTime,
                    color: '#173177',
                  },
                  keyword3: {
                    value: newClassTime,
                    color: '#173177',
                  },
                  keyword4: {
                    value: reason,
                    color: '#173177',
                  },
                  remark: {
                    value: `补课信息如下：补课老师：${newTeacherName}，现教室：${classroom}，请按补课时间准时上课，谢谢！
查看调课记录！`,
                    color: '#173177',
                  },
                };
                if (newTeacherPublicOpenId) {
                  template('enQWSvDApbTOlpYSVhjIoivpMlIrTh8qTeIN4hh6qgA', '', data1, newTeacherPublicOpenId);
                }

              }
            } *
            schoolChangeClass(studentName, courseName, oldClassTime, newClassTime, reason, publicOpenId, teacherPublicOpenId, teacherName) {
              const data = {
                first: {
                  value: `${studentName}的家长，您好！${studentName}的课程发生学校整体调课情况，请注意！`,
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: oldClassTime,
                  color: '#173177',
                },
                keyword3: {
                  value: newClassTime,
                  color: '#173177',
                },
                keyword4: {
                  value: reason,
                  color: '#173177',
                },
                remark: {
                  value: '如有问题请与音曼音乐课堂教务联系，电话：13524160481 , 13564281815。给您造成不便敬请谅解！ ',
                  color: '#173177',
                },
              };
              if (publicOpenId) {
                template('enQWSvDApbTOlpYSVhjIoivpMlIrTh8qTeIN4hh6qgA', '', data, publicOpenId);
              }

            } * schoolChangeClassTeacher(courseName, oldClassTime, newClassTime, reason, teacherPublicOpenId, teacherName) {
              const data1 = {
                first: {
                  value: `${teacherName}老师，您的课程发生学校调课情况，请注意！`,
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: oldClassTime,
                  color: '#173177',
                },
                keyword3: {
                  value: newClassTime,
                  color: '#173177',
                },
                keyword4: {
                  value: reason,
                  color: '#173177',
                },
                remark: {
                  value: '补课信息如下：补课老师：给您造成不便敬请谅解！ ',
                  color: '#173177',
                },
              };
              if (teacherPublicOpenId) {
                template('enQWSvDApbTOlpYSVhjIoivpMlIrTh8qTeIN4hh6qgA', '', data1, teacherPublicOpenId);
              }
            } *
            suspendClasses(studentName, teacherName, courseName, suspendClassesTime, reason, publicOpenId, teacherPublicOpenId, studentId) {
              const data = {
                first: {
                  value: `${studentName}的家长，您好！${studentName}的课程已停课，请注意`,
                  color: '#173177',
                },
                keyword1: {
                  value: teacherName,
                  color: '#173177',
                },
                keyword2: {
                  value: courseName,
                  color: '#173177',
                },
                keyword3: {
                  value: suspendClassesTime,
                  color: '#173177',
                },
                remark: {
                  value: '如有问题请与音曼音乐课堂教务联系，电话：13524160481 , 13564281815。给您造成不便敬请谅解！',
                  color: '#173177',
                },
              };
              if (publicOpenId) {
                template('2hWFn3cM7TUnW_Bro3kxAi91BQIGxnaOsNV3PymleVE', {
                  appid: 'wxdc06b91aef63b7b4',
                  pagepath: `pages/student/myCourse/myCourse?studentId=${studentId}`,
                }, data, publicOpenId);
              }
              const data1 = {
                first: {
                  value: `${teacherName}老师，您的课程${courseName}有学生停课，请注意！`,
                  color: '#173177',
                },
                keyword1: {
                  value: studentName,
                  color: '#173177',
                },
                keyword2: {
                  value: reason,
                  color: '#173177',
                },
                keyword3: {
                  value: suspendClassesTime,
                  color: '#173177',
                },
                remark: {
                  value: '请知晓，合理安排课程资源！',
                  color: '#173177',
                },
              };
              if (teacherPublicOpenId) {
                template('Gk4eklipC5yv05cxrOaAIOiHfn_pb00upvHojBo1ZQs', '', data1, teacherPublicOpenId);
              }
            } *
            transferTheClass(studentName, originalCourseInformation, nowCourseInformation, publicOpenId, teacherName, admin, teacherPublicOpenId, studentId) {
              const data = {
                first: {
                  value: `${studentName}的家长，您好！${studentName}已完成转班，请确认！`,
                  color: '#173177',
                },
                keyword1: {
                  value: studentName,
                  color: '#173177',
                },
                keyword2: {
                  value: originalCourseInformation,
                  color: '#173177',
                },
                keyword3: {
                  value: nowCourseInformation,
                  color: '#173177',
                },
                keyword4: {
                  value: admin,
                  color: '#173177',
                },
                remark: {
                  value: '如有问题请与音曼音乐课堂教务联系，电话：13524160481 , 13564281815。点击查看详情！',
                  color: '#173177',
                },
              };
              if (publicOpenId) {
                template('4Fx3KbLO9-AOFEf9W0mfbev4Ny5-SbcwEOCktNt-kDo', {
                  appid: 'wxdc06b91aef63b7b4',
                  pagepath: `pages/student/myCourse/myCourse?studentId=${studentId}`,
                }, data, publicOpenId);
              }
              const data1 = {
                first: {
                  value: `${teacherName}老师，您的课程发生学生转班情况，请注意！`,
                  color: '#173177',
                },
                keyword1: {
                  value: studentName,
                  color: '#173177',
                },
                keyword2: {
                  value: originalCourseInformation,
                  color: '#173177',
                },
                keyword3: {
                  value: nowCourseInformation,
                  color: '#173177',
                },
                keyword4: {
                  value: admin,
                  color: '#173177',
                },
                remark: {
                  value: '请知晓并提前做好课程准备！',
                  color: '#173177',
                },
              };
              if (teacherPublicOpenId) {
                template('4Fx3KbLO9-AOFEf9W0mfbev4Ny5-SbcwEOCktNt-kDo', '', data1, teacherPublicOpenId);
              }
            } *
            comment(studentName, courseName, teacherName, commentTime, publicOpenId, studentId) {
              const data = {
                first: {
                  value: `${studentName}的同学你好！老师已完成点评`,
                  color: '#173177',
                },
                keyword1: {
                  value: courseName,
                  color: '#173177',
                },
                keyword2: {
                  value: teacherName,
                  color: '#173177',
                },
                keyword3: {
                  value: commentTime,
                  color: '#173177',
                },
                remark: {
                  value: '查看点评详情！',
                  color: '#173177',
                },
              };
              if (publicOpenId) {
                template('JBbRSuDfAOIL7uQt-nEW3dNTeLnm8AHepHZEuFbrYfg', {
                  appid: 'wxdc06b91aef63b7b4',
                  pagepath: `pages/student/myCourse/myCourse?studentId=${studentId}`,
                }, data, publicOpenId);
              }
            }
            // 添加临时课程的通知
    * remedialNotice(studentName, courseName, dateTime, time, teacherName, classroom, publicOpenId, studentId) {

      console.log(studentName, courseName, dateTime, time, teacherName, classroom, publicOpenId, studentId);
      const data = {
        first: {
          value: `${studentName}家长，${studentName}的${courseName}有补课未申请，现有新的补课时间可申请`,
          color: '#173177',
        },
        keyword1: {
          value: dateTime,
          color: '#173177',
        },
        keyword2: {
          value: time,
          color: '#173177',
        },
        keyword3: {
          value: teacherName,
          color: '#173177',
        },
        remark: {
          value: `${classroom}，请及时申请补课！`,
          color: '#173177',
        },
      };
      if (publicOpenId) {
        template('ZExrFLLyeIV_p9BKAAn5tkge4VvNkfq3OG-HxXAsdps', {
          appid: 'wxdc06b91aef63b7b4',
          pagepath: `pages/student/myCourse/myCourse?studentId=${studentId}`,
        }, data, publicOpenId);
      }
    }
    }
  return wechat;

  function template(templateId, miniprogram, data, publicOpenId) {
    let dest;
    if (miniprogram) {
      dest = {
                // url: '',
        miniprogram,
      };
    }
    app.api.sendTemplate(publicOpenId, templateId, dest, data, function(err, result) {
      console.log(err, result);
    });
  }


};
