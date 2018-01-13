/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : yinman

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2017-11-14 13:19:29
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for abrsm
-- ----------------------------
DROP TABLE IF EXISTS `abrsm`;
CREATE TABLE `abrsm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of abrsm
-- ----------------------------
INSERT INTO `abrsm` VALUES ('1', '<h1 style=\"text-align: center;\">英皇考级历史和专长<br></h1><div><div><br></div><div>英国皇家音乐学院联合委员会是一个具有领导地位的国际音乐考试机构，联合委员会每年分布在90多个国家为65余万考生进行考核工作。联合委员会成立于1889年，由英国的四所权威音乐学院（皇家音乐学院、皇家音乐专科学院、皇家北方音乐学院和苏格兰皇家音乐学院）联手组建。在成立的百余年中，委员会不断从实践中总结和吸取经验，同时在和四所皇家音乐学院的联系中受益颇丰。</div></div><div><br></div><div><font color=\"#990033\">核心工作和考纲</font></div><div>我们的核心工作是运行一套权威的、国际认证的考试和评估体系，旨在通过目标的提供以及进步的衡量来鼓励和激励演出者和演唱者。</div><div>考纲涉及广泛的科目。考生可从预备级开始，作为一种简单而积极的评估，然后向演奏考试的8个级别迈进。表演评估针对21岁及以上的成人和其他任何年龄的有特殊需要的考生，他们可以根据自己的选择进行简短的表演，不含有任何考试的压力。</div><div><br></div><div><br></div><div><font color=\"#990033\">等级考试内容：</font></div><div>乐理考试一至八级</div><div>乐理考试是在指定日期举行的笔试，每年举办三次。</div><div>&nbsp;</div><div>演奏考试一至八级</div><div>钢琴考试包含演奏、音阶与琶音、视奏、听力四项环节。</div><div>&nbsp;</div><div>参加演奏6-8级的考生必须先通过5级乐理或5级实际音乐技巧。参加演奏1-5级则无需通过乐理等其他考试。</div><div>&nbsp;</div><div>对等级考试我们没有其他的先决条件的要求，考生可以从任何一级他们认为适当的级别开始报考，而不必按等级次序一级一级地考，尽管我们不鼓励学生们跳级。</div><div>&nbsp;</div><div>&nbsp;表演评估：针对21岁或以上年龄的人，以及那些有特殊的教育需求但不适合等级考试的任何年龄的考生，没有通过或不通过之分，提供书面评估。</div><div><br></div><div><font color=\"#990033\">ABRSM考试时间长度</font></div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;演奏考试&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;乐理</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 钢琴&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 乐理</div><div>预备级&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 10分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;无</div><div>第一级&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 12分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;90分钟</div><div>第二、三级&nbsp; 12分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;90分钟</div><div>第四、五级&nbsp; 15分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 120分钟</div><div>第六级&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 20分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;180分钟</div><div>第七级&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 25分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 180分钟</div><div>第八级&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 30分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;180分钟</div><div>表演评估&nbsp; &nbsp; &nbsp; 15分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 无</div><div><br></div><div><br></div><div><font color=\"#990033\">ABRSM报名与考试指南</font></div><div>&nbsp;</div><div>考试报名</div><div>报名人</div><div>必须提交完整的报名表和交纳所有费用的才能成为报名人，报名人有责任了解规则，并传达与考生有关的信息（和/或家长、监护人、教师）。考试报名相关的所有事宜，联合委员会将主要联系报名人。报名人（18岁及以上）可以是：老师，成年考生，家长或者监护人，也可以是学校学院的领导人或学校的员工。</div><div>&nbsp;</div><div>请注意</div><div>上海代表处仅接受在线报名。 乐理5级（或5级以上级别）考试成绩合格是报考演奏6-8级考试的先决条件，所以不可与演奏6-8级在同一季考，可报考乐理考试结束后下一季的演奏6-8级考试（即在乐理考试成绩公布时报名6-8级演奏）。</div><div><br></div><div><br></div><div><font color=\"#990033\">ABRSM考试过程及注意事项</font></div><div>&nbsp;</div><div>演奏考试</div><div>&nbsp;</div><div>曲目书&nbsp;</div><div>演奏考试的曲目应严格按照考纲的要求选取，考试时须携带正版曲目书。请注意新旧考纲交替期为一年，如2015-2016版钢琴曲目可以沿用至2017年年底。</div><div>&nbsp;</div><div>考试时间长度</div><div>“考试信息”中写出的考试时间是指平均时间，考生在考场内的时间可以根据规定的范围有适当的调整，多于和少于平均时间都是可以的。如果考试提前开始，考生可以选择在规定的时间前开始考试，只要他们作好了准备并乐意这样做。</div><div>&nbsp;</div><div>在考场内</div><div>考官都受到了良好的训练，他们会帮助考生开始他们的考试，也会帮助年轻的考生把他们的凳子或谱架调整到合适的高度。考生可以自由选择他们将从考试的哪一个部分开始，报名人必须保证考生已经了解考试演奏的要求。</div><div>如果有两个考官在场，考生也不必觉得惊讶，ABRSM的制度规定偶尔情况下，可以有第二名考官在场。</div><div>考生必须自己准备伴奏人员，其他人不能留在考场里，除非是一名翻译或者一名翻谱者（在得到允许的情况下）。</div><div>&nbsp;</div><div><font color=\"#990033\">评分</font></div><div>大多数演奏考试是三首由考生从考纲相应的曲目里选出的乐曲、音阶和琶音、视奏（唱）和听觉测试组成。这些考试部分可以根据考生自己的喜好顺序来演奏。</div><div>个人考试的总分为150分，100分及以上为通过、120分及以上为良好、130分及以上为优秀。</div><div>每首乐曲/歌曲的总分为30分（声乐考试有些不同）；音阶、视奏（唱）、快速读谱/传统歌曲的总分为21分；听觉测试的总分为18分。</div><div>各部分分数相加为100分就可以通过考试。每个部分并不要求都通过（每个项目设置的及格分仅用于提示考生有哪些强项和弱项）。若成绩低于70分，则记为INV(无效)。没有通过考试的考生也将收到评分表，考官的评语将对考生参加下一次考试的准备工作提供巨大的帮助。评分表内容为手写英文，可在考试时或考后向代表处预约评分表翻译服务。</div><div>&nbsp;</div><div>预备级和表演评估是不评分的，考官会把建议性的评论写在证书上，考生会在评估结束后拿到证书。</div><div>&nbsp;</div><div><font color=\"#990033\">乐理考试</font></div><div>&nbsp;</div><div>评分</div><div>理论考试的总分为100分，66分及以上为及格，80分及以上为良好，90及以上为优秀。没有通过考试的考生也将收到记录各部分成绩的评分表，以便更好地准备下一次考试。</div><div><br></div><div>考试之后</div><div>评分表和证书</div><div>每个参加等级考试的考生都会收到一份评分表，包括每一部分的分数和总分。演奏考试的成绩表也包括考官对各部分的评论。证书被授予所有成功通过考试的考生，作为对自己所取得的成绩的证明。</div>');
INSERT INTO `abrsm` VALUES ('2', '<h1>英皇考级历史和专长</h1><div>英国皇家音乐学院联合委员会是一个具有领导地位的国际音乐考试机构，联合委员会每年分布在90多个国家为65余万考生进行考核工作。联合委员会成立于1889年，由英国的四所权威音乐学院（皇家音乐学院、皇家音乐专科学院、皇家北方音乐学院和苏格兰皇家音乐学院）联手组建。在成立的百余年中，委员会不断从实践中总结和吸取经验，同时在和四所皇家音乐学院的联系中受益颇丰。</div><div>&nbsp;</div><div>核心工作和考纲</div><div>我们的核心工作是运行一套权威的、国际认证的考试和评估体系，旨在通过目标的提供以及进步的衡量来鼓励和激励演出者和演唱者。</div><div>考纲涉及广泛的科目。考生可从预备级开始，作为一种简单而积极的评估，然后向演奏考试的8个级别迈进。表演评估针对21岁及以上的成人和其他任何年龄的有特殊需要的考生，他们可以根据自己的选择进行简短的表演，不含有任何考试的压力。</div><div><br></div><div><br></div><div>等级考试内容：</div><div>乐理考试一至八级</div><div>乐理考试是在指定日期举行的笔试，每年举办三次。</div><div>&nbsp;</div><div>演奏考试一至八级</div><div>钢琴考试包含演奏、音阶与琶音、视奏、听力四项环节。</div><div>&nbsp;</div><div>参加演奏6-8级的考生必须先通过5级乐理或5级实际音乐技巧。参加演奏1-5级则无需通过乐理等其他考试。</div><div>&nbsp;</div><div>对等级考试我们没有其他的先决条件的要求，考生可以从任何一级他们认为适当的级别开始报考，而不必按等级次序一级一级地考，尽管我们不鼓励学生们跳级。</div><div>&nbsp;</div><div>&nbsp;表演评估：针对21岁或以上年龄的人，以及那些有特殊的教育需求但不适合等级考试的任何年龄的考生，没有通过或不通过之分，提供书面评估。</div><div><br></div><div>ABRSM考试时间长度</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;演奏考试&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;乐理</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 钢琴&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 乐理</div><div>预备级&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 10分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;无</div><div>第一级&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 12分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;90分钟</div><div>第二、三级&nbsp; 12分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;90分钟</div><div>第四、五级&nbsp; 15分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 120分钟</div><div>第六级&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 20分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;180分钟</div><div>第七级&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 25分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 180分钟</div><div>第八级&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 30分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;180分钟</div><div>表演评估&nbsp; &nbsp; &nbsp; 15分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 无</div><div><br></div><div><br></div><div>ABRSM报名与考试指南</div><div>&nbsp;</div><div>考试报名</div><div>报名人</div><div>必须提交完整的报名表和交纳所有费用的才能成为报名人，报名人有责任了解规则，并传达与考生有关的信息（和/或家长、监护人、教师）。考试报名相关的所有事宜，联合委员会将主要联系报名人。报名人（18岁及以上）可以是：老师，成年考生，家长或者监护人，也可以是学校学院的领导人或学校的员工。</div><div>&nbsp;</div><div>请注意</div><div>上海代表处仅接受在线报名。 乐理5级（或5级以上级别）考试成绩合格是报考演奏6-8级考试的先决条件，所以不可与演奏6-8级在同一季考，可报考乐理考试结束后下一季的演奏6-8级考试（即在乐理考试成绩公布时报名6-8级演奏）。</div><div><br></div><div><br></div><div>ABRSM考试过程及注意事项</div><div>&nbsp;</div><div>演奏考试</div><div>&nbsp;</div><div>曲目书&nbsp;</div><div>演奏考试的曲目应严格按照考纲的要求选取，考试时须携带正版曲目书。请注意新旧考纲交替期为一年，如2015-2016版钢琴曲目可以沿用至2017年年底。</div><div>&nbsp;</div><div>考试时间长度</div><div>“考试信息”中写出的考试时间是指平均时间，考生在考场内的时间可以根据规定的范围有适当的调整，多于和少于平均时间都是可以的。如果考试提前开始，考生可以选择在规定的时间前开始考试，只要他们作好了准备并乐意这样做。</div><div>&nbsp;</div><div>在考场内</div><div>考官都受到了良好的训练，他们会帮助考生开始他们的考试，也会帮助年轻的考生把他们的凳子或谱架调整到合适的高度。考生可以自由选择他们将从考试的哪一个部分开始，报名人必须保证考生已经了解考试演奏的要求。</div><div>如果有两个考官在场，考生也不必觉得惊讶，ABRSM的制度规定偶尔情况下，可以有第二名考官在场。</div><div>考生必须自己准备伴奏人员，其他人不能留在考场里，除非是一名翻译或者一名翻谱者（在得到允许的情况下）。</div><div>&nbsp;</div><div>评分</div><div>大多数演奏考试是三首由考生从考纲相应的曲目里选出的乐曲、音阶和琶音、视奏（唱）和听觉测试组成。这些考试部分可以根据考生自己的喜好顺序来演奏。</div><div>个人考试的总分为150分，100分及以上为通过、120分及以上为良好、130分及以上为优秀。</div><div>每首乐曲/歌曲的总分为30分（声乐考试有些不同）；音阶、视奏（唱）、快速读谱/传统歌曲的总分为21分；听觉测试的总分为18分。</div><div>各部分分数相加为100分就可以通过考试。每个部分并不要求都通过（每个项目设置的及格分仅用于提示考生有哪些强项和弱项）。若成绩低于70分，则记为INV(无效)。没有通过考试的考生也将收到评分表，考官的评语将对考生参加下一次考试的准备工作提供巨大的帮助。评分表内容为手写英文，可在考试时或考后向代表处预约评分表翻译服务。</div><div>&nbsp;</div><div>预备级和表演评估是不评分的，考官会把建议性的评论写在证书上，考生会在评估结束后拿到证书。</div><div>&nbsp;</div><div>乐理考试</div><div>&nbsp;</div><div>评分</div><div>理论考试的总分为100分，66分及以上为及格，80分及以上为良好，90及以上为优秀。没有通过考试的考生也将收到记录各部分成绩的评分表，以便更好地准备下一次考试。</div><div><br></div><div>考试之后</div><div>评分表和证书</div><div>每个参加等级考试的考生都会收到一份评分表，包括每一部分的分数和总分。演奏考试的成绩表也包括考官对各部分的评论。证书被授予所有成功通过考试的考生，作为对自己所取得的成绩的证明。</div>');
INSERT INTO `abrsm` VALUES ('3', '<h1><font color=\"#990000\">英皇考级历史和专长</font></h1><div>英国皇家音乐学院联合委员会是一个具有领导地位的国际音乐考试机构，联合委员会每年分布在90多个国家为65余万考生进行考核工作。联合委员会成立于1889年，由英国的四所权威音乐学院（皇家音乐学院、皇家音乐专科学院、皇家北方音乐学院和苏格兰皇家音乐学院）联手组建。在成立的百余年中，委员会不断从实践中总结和吸取经验，同时在和四所皇家音乐学院的联系中受益颇丰。</div><div>&nbsp;</div><div>核心工作和考纲</div><div>我们的核心工作是运行一套权威的、国际认证的考试和评估体系，旨在通过目标的提供以及进步的衡量来鼓励和激励演出者和演唱者。</div><div>考纲涉及广泛的科目。考生可从预备级开始，作为一种简单而积极的评估，然后向演奏考试的8个级别迈进。表演评估针对21岁及以上的成人和其他任何年龄的有特殊需要的考生，他们可以根据自己的选择进行简短的表演，不含有任何考试的压力。</div><div><br></div><div><br></div><div>等级考试内容：</div><div>乐理考试一至八级</div><div>乐理考试是在指定日期举行的笔试，每年举办三次。</div><div>&nbsp;</div><div>演奏考试一至八级</div><div>钢琴考试包含演奏、音阶与琶音、视奏、听力四项环节。</div><div>&nbsp;</div><div>参加演奏6-8级的考生必须先通过5级乐理或5级实际音乐技巧。参加演奏1-5级则无需通过乐理等其他考试。</div><div>&nbsp;</div><div>对等级考试我们没有其他的先决条件的要求，考生可以从任何一级他们认为适当的级别开始报考，而不必按等级次序一级一级地考，尽管我们不鼓励学生们跳级。</div><div>&nbsp;</div><div>&nbsp;表演评估：针对21岁或以上年龄的人，以及那些有特殊的教育需求但不适合等级考试的任何年龄的考生，没有通过或不通过之分，提供书面评估。</div><div><br></div><div>ABRSM考试时间长度</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;演奏考试&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;乐理</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 钢琴&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 乐理</div><div>预备级&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 10分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;无</div><div>第一级&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 12分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;90分钟</div><div>第二、三级&nbsp; 12分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;90分钟</div><div>第四、五级&nbsp; 15分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 120分钟</div><div>第六级&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 20分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;180分钟</div><div>第七级&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 25分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 180分钟</div><div>第八级&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 30分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;180分钟</div><div>表演评估&nbsp; &nbsp; &nbsp; 15分钟&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 无</div><div><br></div><div><br></div><div>ABRSM报名与考试指南</div><div>&nbsp;</div><div>考试报名</div><div>报名人</div><div>必须提交完整的报名表和交纳所有费用的才能成为报名人，报名人有责任了解规则，并传达与考生有关的信息（和/或家长、监护人、教师）。考试报名相关的所有事宜，联合委员会将主要联系报名人。报名人（18岁及以上）可以是：老师，成年考生，家长或者监护人，也可以是学校学院的领导人或学校的员工。</div><div>&nbsp;</div><div>请注意</div><div>上海代表处仅接受在线报名。 乐理5级（或5级以上级别）考试成绩合格是报考演奏6-8级考试的先决条件，所以不可与演奏6-8级在同一季考，可报考乐理考试结束后下一季的演奏6-8级考试（即在乐理考试成绩公布时报名6-8级演奏）。</div><div><br></div><div><br></div><div>ABRSM考试过程及注意事项</div><div>&nbsp;</div><div>演奏考试</div><div>&nbsp;</div><div>曲目书&nbsp;</div><div>演奏考试的曲目应严格按照考纲的要求选取，考试时须携带正版曲目书。请注意新旧考纲交替期为一年，如2015-2016版钢琴曲目可以沿用至2017年年底。</div><div>&nbsp;</div><div>考试时间长度</div><div>“考试信息”中写出的考试时间是指平均时间，考生在考场内的时间可以根据规定的范围有适当的调整，多于和少于平均时间都是可以的。如果考试提前开始，考生可以选择在规定的时间前开始考试，只要他们作好了准备并乐意这样做。</div><div>&nbsp;</div><div>在考场内</div><div>考官都受到了良好的训练，他们会帮助考生开始他们的考试，也会帮助年轻的考生把他们的凳子或谱架调整到合适的高度。考生可以自由选择他们将从考试的哪一个部分开始，报名人必须保证考生已经了解考试演奏的要求。</div><div>如果有两个考官在场，考生也不必觉得惊讶，ABRSM的制度规定偶尔情况下，可以有第二名考官在场。</div><div>考生必须自己准备伴奏人员，其他人不能留在考场里，除非是一名翻译或者一名翻谱者（在得到允许的情况下）。</div><div>&nbsp;</div><div>评分</div><div>大多数演奏考试是三首由考生从考纲相应的曲目里选出的乐曲、音阶和琶音、视奏（唱）和听觉测试组成。这些考试部分可以根据考生自己的喜好顺序来演奏。</div><div>个人考试的总分为150分，100分及以上为通过、120分及以上为良好、130分及以上为优秀。</div><div>每首乐曲/歌曲的总分为30分（声乐考试有些不同）；音阶、视奏（唱）、快速读谱/传统歌曲的总分为21分；听觉测试的总分为18分。</div><div>各部分分数相加为100分就可以通过考试。每个部分并不要求都通过（每个项目设置的及格分仅用于提示考生有哪些强项和弱项）。若成绩低于70分，则记为INV(无效)。没有通过考试的考生也将收到评分表，考官的评语将对考生参加下一次考试的准备工作提供巨大的帮助。评分表内容为手写英文，可在考试时或考后向代表处预约评分表翻译服务。</div><div>&nbsp;</div><div>预备级和表演评估是不评分的，考官会把建议性的评论写在证书上，考生会在评估结束后拿到证书。</div><div>&nbsp;</div><div>乐理考试</div><div>&nbsp;</div><div>评分</div><div>理论考试的总分为100分，66分及以上为及格，80分及以上为良好，90及以上为优秀。没有通过考试的考生也将收到记录各部分成绩的评分表，以便更好地准备下一次考试。</div><div><br></div><div>考试之后</div><div>评分表和证书</div><div>每个参加等级考试的考生都会收到一份评分表，包括每一部分的分数和总分。演奏考试的成绩表也包括考官对各部分的评论。证书被授予所有成功通过考试的考生，作为对自己所取得的成绩的证明。</div>');

-- ----------------------------
-- Table structure for booking_course
-- ----------------------------
DROP TABLE IF EXISTS `booking_course`;
CREATE TABLE `booking_course` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentId` int(11) NOT NULL,
  `createTime` datetime NOT NULL DEFAULT '2017-01-01 00:00:00',
  `state` varchar(20) NOT NULL,
  `confirmedId` int(11) DEFAULT NULL,
  `courseTableItemId` int(11) NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `requirement` text,
  `afterCourseDeleTeSaveInfo` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of booking_course
-- ----------------------------

-- ----------------------------
-- Table structure for booking_course_time
-- ----------------------------
DROP TABLE IF EXISTS `booking_course_time`;
CREATE TABLE `booking_course_time` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingCourseId` int(11) NOT NULL,
  `time` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of booking_course_time
-- ----------------------------

-- ----------------------------
-- Table structure for booking_wetchat
-- ----------------------------
DROP TABLE IF EXISTS `booking_wetchat`;
CREATE TABLE `booking_wetchat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingCourseId` int(11) NOT NULL,
  `isSend` int(11) NOT NULL DEFAULT '0',
  `sendTime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of booking_wetchat
-- ----------------------------

-- ----------------------------
-- Table structure for classroom
-- ----------------------------
DROP TABLE IF EXISTS `classroom`;
CREATE TABLE `classroom` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `isPiano` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of classroom
-- ----------------------------
INSERT INTO `classroom` VALUES ('13', '三楼北', '1509537906455', '1');
INSERT INTO `classroom` VALUES ('14', '二楼南', '1509537916727', '1');
INSERT INTO `classroom` VALUES ('15', '二楼北', '1509537923564', '1');
INSERT INTO `classroom` VALUES ('16', '地下南', '1509537931933', '0');
INSERT INTO `classroom` VALUES ('17', '地下北', '1509537937948', '0');

-- ----------------------------
-- Table structure for competitionpresentation
-- ----------------------------
DROP TABLE IF EXISTS `competitionpresentation`;
CREATE TABLE `competitionpresentation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL,
  `place` varchar(40) NOT NULL,
  `time` varchar(20) NOT NULL,
  `competitionPresentation` text NOT NULL,
  `creatTime` varchar(20) NOT NULL,
  `updateTime` varchar(20) DEFAULT NULL,
  `picId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of competitionpresentation
-- ----------------------------
INSERT INTO `competitionpresentation` VALUES ('1', '第十三届世界华人青少年艺术节', '上海市群艺馆（古宜路125号）', '2017年5月28、29日（暂定）', '<div><img src=\"https://wx.yinmanyinyue.com/public/files/171019/20171019134554481.jpg\"><br></div><div>前言</div><div>“第十三届世界华人青少年艺术节”是中华文化五洲行大型文化艺术交流的第四十八届艺术人才选拔活动。</div><div>世界华人青少年艺术节（TheArt Festival of World Chinese Adolescents），是中华文化五洲行系列活动中声参与人数众多、影响广泛的文化品牌。自2005年首届艺术节开展以来，通过鲜明的主题、精心的组织策划、精彩缤纷的才艺展示，快速红遍了祖国的大江南北，受到了全球数家媒体的广泛关注，中国中央电视台新闻联播给予了全方位的报道，获得了各国选手的推崇与认可。</div><div>党的第十七届三中全会提出了“要推动中华文化走向世界不断增强中华文化的国际影响力”的精神。中华文化五洲行系列活动作为以华侨为主体的民间组织的大型国际文化艺术交流活动的先驱者，以弘扬中华文化为宗旨，作用于促进祖国完全和平统一的宏伟大业，对增强海内外华人的凝聚力起到了重要的作用，为中华文化走出国门、走向世界做出了重要的贡献。世界华人青少年艺术节成为一条维系海内外华人情感的文化纽带。</div><div>“世界只有一个中国”的口号，旗帜鲜明的阐述了中华文化五洲行系列活动坚定正确的政治方向，顺应了和谐进步的历史潮流，赢得了全球各界华人的广泛认同。中央人民政府宣传文化部副部长蔡文中先生对艺术节做出高度评价：“世界华人青少年艺术节自举办以来，一直秉承爱国旗帜，以大力弘扬民族精神，全面展示中华优秀文化为宗旨。使广大青少年在这个大舞台里学习到中华民族优秀的艺术，培养成为热爱文化艺术，品德高尚的民族精英，为祖国争光添彩。世界华人青少年艺术节已经成为全球华侨华人青少年集体参与的爱国主义文化平台。”</div><div>由国内外著名艺术家组成的专业评委阵容，高品位、高规格的国内外选拔活动场馆，成就了艺术节的高质量；热情、严谨、周密、细致的服务，使整个活动组织工作井然有序。赢得了评委、陪同家长、选手和各国华侨的赞许。艺术节组委会永远把公益和社会效益作为服务的第一位。我们将携手每一位选手，共同成长。为每一位艺术雏苗提供一个公平公正公开的成长舞台！世界只有一个中国为主题！</div><div>中华文化五洲行六个赛事已经第十二个年了，每年定期举办一届以下赛事：香港国际青少年艺术节；世界华人青少年艺术节；香港国际钢琴公开赛；海外桃李杯国际舞蹈大赛；海峡两岸四地青少年艺术节；世界华人艺术节。很多获奖选手通过舞台锻炼申请到了理想的院校。2017年春夏季举行的第13届世界华人青少年艺术节我们将在马来西亚双峰塔举办盛大的开幕式，欢迎你们的到来！</div><div><br></div><div>组织机构批文</div><div><br></div><div><br></div><div>宗旨&nbsp;</div><div>世界只有一个中国为主题！</div><div>中华文化五洲行六个赛事已经第十二个年了，每年定期举办一届以下赛事：香港国际青少年艺术节；世界华人青少年艺术节；香港国际钢琴公开赛；海外桃李杯国际舞蹈大赛；海峡两岸四地青少年艺术节；世界华人艺术节。很多获奖选手通过舞台锻炼申请到了理想的院校。2017年春夏季举行的第13届世界华人青少年艺术节我们将在马来西亚双峰塔举办盛大的开幕式，欢迎你们的到来！</div><div>&nbsp;（一）本次活动由世界华侨华人社团联合总会、世界华侨华人社团马来西亚分会主办。由中国人民对外友好协会、中国教育国际交流协会、中国民族管弦乐学会支持。邀请各省、市成立艺术节活动组委会、联合当地的文化、教育、院校及华侨团体的力量， 制定计划、统一部署、协调工作，以确保艺术节活动的宣传组织工作得以落实。</div><div>（二）邀请全国著名社会公益活动家、艺术家、教育家等权威人士担任艺术节顾问和评委、 指导艺术节工作，评选出优秀节目，以保证艺术节活动的专业性、权威性和公正性。</div><div>影响</div><div>（一）社会影响：</div><div>此次活动通过艺术平台展示“同根同宗 同源 友情 亲情中华情”这种血浓于水的中华情结，加深海外侨胞心系统一、心向中华的凝聚力。</div><div>（二）对选手群体的影响：</div><div>通过艺术节的文化平台，展示选手多才多艺、全面发展的风貌。</div><div>（三）活动对象：</div><div>1、高等院校、专业艺术院校、中、小学在校生、幼儿园、艺术团体和个人，有特长艺术造诣华侨华人子弟及海外华侨华人文艺爱好者，均可报名参加艺术节活动。</div><div>2、选手应本着重在参与的原则。只有完全尊重认同评委的评审结果的选手，才有资格参加新加坡.马来西亚总决选。</div><div>机构</div><div>（一）机构设置</div><div>主办单位：</div><div>世界华侨华人社团联合总会</div><div>中国优秀特长生评审学会</div><div>支持单位&nbsp;&nbsp;</div><div>中国人民对外友好协会</div><div>中国教育国际交流协会</div><div>中国民族管弦乐学会</div><div>承办单位</div><div>深圳市五洲行艺术团责任有限公司（中国区）</div><div>上海正象文化发展有限公司（上海区）</div><div><br></div><div>（二）艺术顾问:（排名不分先后）</div><div>朴东生&nbsp; &nbsp; &nbsp; &nbsp; 中国民族管弦乐学会荣誉会长</div><div>潘志涛 &nbsp; &nbsp; 北京舞蹈学院教授、“桃李杯”舞蹈大赛创始人</div><div>包胡尔查&nbsp; &nbsp;国内著名音乐人、演艺策划人。 </div><div>王惠然 &nbsp; &nbsp; 中国柳琴学会会长、中国民族管弦乐学会常务理事</div><div>崔鸿根&nbsp; &nbsp; &nbsp; &nbsp; 中央音乐学院钢琴系教授、硕士生导师 </div><div>刘连伦&nbsp; &nbsp; &nbsp; &nbsp; 中央电视台戏曲音乐频道编导 </div><div>许文绮&nbsp; &nbsp; &nbsp; 中国民族民间舞考级教材编委、考级部主任 </div><div>法兰克•许&nbsp; &nbsp;全美弦乐教师协会副会长 </div><div>杨青&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 北京首都师范大学音乐学院院长、中国民族管弦乐学会副会长</div><div>陈幼倩&nbsp; &nbsp; &nbsp; &nbsp; 美国乔治亚洲大学钢琴教授 </div><div>刘长安&nbsp; &nbsp; &nbsp; &nbsp; 中国原创音乐家协会副会长、广东省音乐家协会主席 </div><div>马小红&nbsp; &nbsp; &nbsp; &nbsp; 首都师范大学音乐学院钢琴系主任 </div><div>崔锦兰&nbsp; &nbsp; &nbsp; &nbsp; 中央民族大学音乐学院钢琴系主任 </div><div>张盛金&nbsp; &nbsp; &nbsp; &nbsp; 世界华人音乐家协会副主席 </div><div>Read Gainsford&nbsp; &nbsp;博士，佛罗里达州立大学钢琴教授 </div><div>&nbsp;</div><div>（三） 第十三届世界华人青少年艺术节组委会</div><div>荣誉主席：汪伟世界华侨华人社团联合总会常务副秘书长</div><div>总策划：王绣华中国国际文化艺术交流协会会长</div><div>主&nbsp; &nbsp;任：马平顺中华文化五洲行组委会主任</div><div>上海赛区主任：王祯</div><div>副主任：倪瑾</div><div>执行总监：王慧敏&nbsp;</div><div>办公室主任：孔维娜，李军</div><div>地址：上海市长宁区哈密路442号铭晖商务楼408室</div><div>办公室电话：021-62360501&nbsp; &nbsp;021-62180689</div><div>投 诉 电 话：18918661279&nbsp; &nbsp; &nbsp;&nbsp;</div><div>官方邮箱 E-mail: chinawzxsh@.163.com；1059598515@qq.com</div><div>官方网站：www.chinawzxsh.org</div><div>组别</div><div>（一）参赛项目：</div><div>声乐——按独唱、重唱、小组唱、合唱、表演唱分类。（少年组以下不分唱法）；青年组按（流行、民族、美声）分类。</div><div>西洋管乐——铜管、木管等；按独奏、重奏、室内乐、大中小型乐团分类。</div><div>西洋弦乐——按独奏、重奏、室内乐、大中小型乐团分类。</div><div>键盘——钢琴、电子琴、双排键；按独奏、四手联弹、重奏分类。。</div><div>打击乐——按爵士鼓、小军鼓分类。</div><div>民族器乐——按独奏、重奏、大中小型乐团分类。</div><div>语言表演——相声、小品、模特、戏曲、武术、跆拳道、音乐剧、朗诵、诗歌、散文、故事、寓言等；按个人、集体分类。</div><div>国际英语——英语朗诵、英语歌曲；按个人、集体分类。。</div><div>书法——书法:软笔书法、硬笔书法；</div><div>绘画——国画、油画、儿童画、水彩画、水粉画、素描、简笔画、漫画、创意画分类。</div><div>书法的纸张不得小于4尺对开(110×32cm)；绘画纸张最小（55×39cm）最大(110×32cm)请书画选手自备笔墨纸砚等物品现场作画。)</div><div><br></div><div>（二）参赛组别：本次艺术节总决选设专业组、业余组、海外组。</div><div>学 前 组： 3- 6岁(2010年6月1日以后出生)</div><div>儿童A组： 7- 9岁(2007年6月1日-2010年5月31日出生)</div><div>儿童B组：10-12岁(2004年6月1日-2007年5月31日出生)</div><div>少年A组：13-15岁(2001年6月1日-2004年5月31日出生)</div><div>少年B组：16-18岁(1998年6月1日-2001年5月31日出生)</div><div>青年A组：19-23岁(1993年6月1日-1998年5月31日出生)</div><div>青年B组：24-28岁(1988年6月1日-1993年5月31日出生)</div><div>（三）以上项目自由选曲，限时三分钟内。</div><div>时间</div><div>（一）上海选拔赛时间：2017年5月28、29日（暂定）</div><div>（二）上海选拔赛地点：上海市群艺馆（古宜路125号）</div><div>（三）上海赛报名截止：2017年5月10日</div><div>（四）上海赛参赛费用：500元 / 项；加项300元 / 项</div><div>（五）总决赛时间：</div><div>&nbsp; 马来西亚吉隆坡2017年8月1日-6日</div><div>&nbsp; 8月4日上午8: 00 - 18: 00,&nbsp; 全天各项比赛</div><div>&nbsp; 8月4日19: 00，闭幕晚宴。（暂定）</div><div>&nbsp; 地点： 吉隆坡王岳海大礼堂（暂定）</div><div>&nbsp; 亚洲区预选赛报名截止日期：2017年6月20日</div><div>奖项</div><div>总决赛组委会按照专业组业余组设奖。各组按组别、项目设奖。奖项设置按照标准名称设置：</div><div>1、金奖：占总人数节目10％；</div><div>2、银奖：占总人数节目20％；</div><div>3、铜奖：占总人数节目30％，以上颁发获奖证书。</div><div>其他参赛选手颁发“优秀选手奖”证书。获得金奖的辅导老师颁发“优秀指导老师”证书。</div><div>总决赛奖项设置：</div><div>（一）艺术节组委会按照专业组、业余组、海外组设奖。按照各组别、类别、个人项目、集体项目设奖项：获金、银、铜奖颁发奖杯、证书，其他参加总决选的选手颁发国际优秀艺术人才奖证书。特别说明：获集体奖的选手每人均颁发奖杯及证书。</div><div>（二）获金奖选手的辅导教师将荣获“国际优秀辅导教师奖”证书。特别注意，凡未在报名表中填写教师详细资料者，不予补充颁发教师获奖证书及不入选世界华人特刊。</div><div>（三）获奖选手的照片（剧照和获金奖选手辅导教师的照片）将在世界华人杂志彩色版刊登。组委会将免费赠送获金、银、铜奖选手彩色精装《世界华人》特刊一本。</div><div>（四）集体荣誉奖设置：优秀组织奖、育才成果奖。</div><div><br></div><div>☆艺术节的监督</div><div>各地区须严格按照组委会统一原则进行操作，所有参选选手均有行使监督投诉的权力。如有违规发生，一经查实，组委会将视情节给予警告直至取消该地区资格的处分，各地区违规操作所产生的一切经济、法律责任由该地区自行承担，组委会不承担联带责任。</div><div>☆组委会为每位参加总决选的选手办理40万元人身意外保险</div><div>细则</div><div>1、各类参选作品要健康向上、热情活泼、个性突出、大胆创新、风格多样。在同年龄组别单项人数不满十五人的将列入综合组奖。凡单项人数超过50人的均设单项奖，颁发单项奖证书。参赛者必须按照各组别要求进行报名、按出生年月分组报名时必须提供有效证件复印件。</div><div>2、所有参赛选手需自备（表演服装、器械、道具、乐器等）</div><div>3、本届比赛组委会提供三角钢琴一台、架子鼓（五鼓）一套、古筝两架（D、G调），其他定调古筝自备，组委会不设调音服务，除以上乐器外其余乐器选手自备。</div><div>4、比赛先后次序按组委会规定的程序决定，组委会有必要时可将比赛时间调动，参赛者不可有异议；</div><div>5、曲目演奏要求：个人节目比赛时间限定在3分钟之内、集体节目比赛时间限定在5分钟之内。请删减重复段落、限定自选曲目一首、现场计时，超时叫停、不影响评分。</div><div>6、伴奏音乐格式必须为MP3格式音乐、128kbps及以上；赛场不设伴奏钢琴、请在比赛前两周发至组委会邮箱：1059598515@qq.com （注明：姓名+参赛项目+曲目名称）比赛当天请带伴奏U盘备用。</div><div>7、艺术节的各项活动，凭参赛证参加，无证者恕不接待。</div><div>8、按规定时间准时签到、参赛；迟到者在本轮比赛最后补赛；</div><div>9、严肃赛场纪律，选手按工作人员指定位置候场，进入赛场关闭一切通讯设备；禁止大声喧哗、随意走动。</div><div>10、报名截止后参赛者已缴纳的费用将不予退还或转让他人。</div><div>11、请所有选手关注首页微信码，赛场时间安排会于比赛日前一周天在公众微信号和官方网站上公布。</div><div>12、本次艺术节组委会拥有获奖选手的肖像使用权、姓名使用权、拥有电视晚会的录制、播放的使用权。对本细则有异议者谢绝参赛！</div><div>评分</div><div>(一)本着“公平、公开、公正”的原则，严格执行评委守则。</div><div>(二)总决选评委设置：每个项目均有国家级艺术家参加评审，每场不少于三名评委，要求具备国家一级资质。</div><div>(三)所有项目满分为10分，&nbsp;</div><div>(四)以上项目评分保留小数点后二位。</div><div>费用</div><div>上海赛参赛费用：500元 / 项；加项300元 / 项。</div><div>上海选拔赛时间：2017年5月28、29日（暂定）</div><div>上海赛摄像服务：收费标准200元（含选手独立参赛摄像U盘）</div><div>上海选拔赛地点：上海市群艺馆（古宜路125号）</div><div><br></div><div>总决赛时间费用</div><div>1、新马比赛费用：选手8580元/人，加项2500元/人，领队及陪同7980元/人，持外籍护照的选手及陪同需另加收500元/人。（该收费为从组委会指定香港出发的费用，其他地区根据机票金额做上下调整，包括6天5晚的食宿、交通费、组委会指定地点出发的至吉隆坡的航班费、媒体宣传费、评审费、保险费、场地费、总决选服务费、灯光音响租赁费、证书、奖杯及奖牌费用等。不含每人240元领队导游小费）。</div><div>报名后因故不能参选的人员，6月20日后不予退款；为保证艺术节的品质，所有人员必须参加组委会统一计划行程。</div><div>获奖选手将荣获中国优秀特长生评审学会颁发的“中国优秀特长生”荣誉称号。费用另行通知&nbsp; &nbsp;&nbsp;</div><div><br></div>', '2017.9.28', '2017.10.19', '14');
INSERT INTO `competitionpresentation` VALUES ('2', '第七届香港国际钢琴赛', '上海星舞台（徐汇区古宜路125号）市群艺馆剧院', '2017年5月28日、29日(暂定）', '<div><img src=\"https://wx.yinmanyinyue.com/public/files/171019/2017101913467401.jpg\"><br></div><div>&nbsp;“第七届香港国际钢琴赛”有1800余名来自海内外26个国家和地区的青少年选手欢聚香江，龙争虎斗，大显身手！每一届上海地区赛江浙沪各地参加总人数千人次，进入香港总决赛的有数百人次，上海选拔赛除了中国上海籍，江苏，浙江等选手还有来自美国籍、澳洲籍、日本籍、韩国籍、新加坡籍、台湾籍、澳门籍以及东南亚一些选手及九大音乐院校的选手参赛。</div><div>贴心的服务，庄重的赛场，让每一个参赛选手回味无穷。热爱钢琴艺术的青少年朋友们！你们的舞台已开启！东方之珠张开臂膀欢迎你们的到来！！</div><div><br></div><div>组织机构</div><div><br></div><div>主办单位：(香港）国际艺术专业等级评审协会</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;中国优秀特长生评委学会</div><div>支持单位： 中国人民对外友好协会</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;中国教育国际交流协会</div><div>承办单位： 深圳市五洲行艺术团有限责任公司（中国区）</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;上海正象文化发展有限公司（上海区）</div><div>组委会成员</div><div><br></div><div>第八届香港国际钢琴公开赛组委会 (中国区)</div><div>总 策 划：王绣华 中国国际文化艺术交流协会会长</div><div>主&nbsp; &nbsp; 任：马平顺 中华文化五洲行组委会主任</div><div>第八届香港国际钢琴公开赛组委会 (上海区)</div><div>主&nbsp; 任：王祯</div><div>副主任：倪瑾</div><div>执行总监：王慧敏</div><div>办公室主任：孔维娜 李军</div><div>地 址：上海市长宁区哈密路442号铭晖商务楼408室</div><div>办公室电话：021- 62360501-/62180689</div><div>投诉电话：18918661279 邮编：200010</div><div>官方邮箱E-mail: chinawzxsh@.163.com；1059598515@qq.com</div><div>官方网站：www.chinawzxsh.org</div><div>参赛资格认证</div><div><br></div><div>（一）香港国际钢琴公开赛按省、市或地区成立分赛区组委会，联合当地的宣传、文化、教育、院校、华侨团体，制定计划，协调工作，确保大赛活动的宣传组织工作得以落实。</div><div>（二）邀请社会活动家、艺术家等担任大赛顾问和评委。</div><div>（三）本届钢琴公开赛得到了海内、外多家媒体的跟踪报道。本届钢琴公开赛仍将有包括央视在内的电视、广播、报刊、杂志、网络等众多媒体的报导本届活动。</div><div>（四）选手本着重在参与的原则自愿报名。只有完全认同评委评审结果、承认公开赛各项规则的选手才有资格参加各地区的决赛和总决赛。进入总决赛选手在“选手协议书”签字后才能最后确定资格。&nbsp;</div><div>（五）中国大陆具有一定艺术专长的青少年包括高等院校、专业艺术院校、中学、小学在校生， 艺术团体和个人，及国内各类钢琴考级中获得级别资格认证的选手，均有资格报名参加公开赛活动。&nbsp;</div><div>上海邀请赛时间地点及费用</div><div><br></div><div>&nbsp; &nbsp; &nbsp;上海邀请赛时间：2017年5月28日、29日(暂定）</div><div>&nbsp; &nbsp; 上海邀请赛报名截止时间：2017年5月10日</div><div>&nbsp; &nbsp; 上海邀请赛地点：上海星舞台（徐汇区古宜路125号）市群艺馆剧院</div><div>&nbsp; &nbsp; 上海邀请赛费用：500元 / 项；加项300元 / 项</div><div>&nbsp; &nbsp; 摄像服务：收费标准200元(含选手独立参赛摄像U盘）</div><div>&nbsp; &nbsp; 上海赛邀请赛所需资料：2寸彩色证件照4张，身份证复印件或户口簿单页复印件。</div><div><br></div><div>香港总决赛时间地点及费用</div><div><br></div><div>香港总决赛时间：2016年7月27日-7月30日（暂定）</div><div>香港总决赛报名截止时间：2017年6月20日</div><div>总决赛参赛所需资料：报名时须附有效身份证或户口薄或护照复印件，提前办理好“往来港澳通行证”、认真填写《报名表》各项内容，并提供本人两寸免冠彩色照片4张。进入总决赛的选手需提交参选选手协议书、1张电子版艺术照或生活照。</div><div>香港总决赛费用：选手4280元/人，加项2000元/项；陪同3980元/人， 拼房陪同2480元/人；</div><div>（在香港的四天三晚食宿费住宿费、深圳口岸至香港酒店的接送费、保险费、场地费、评审费、宣传费、奖杯证书制作费、管理费等）。</div><div>特别说明：一个陪同的选手分配标准大床房间，除广东、香港、澳门户籍选手外其他地区选手必须参加组委会统一组织安排的食宿行。</div><div>业余组组别及曲目</div><div><br></div><div>注：少儿（业余）组参赛曲目均可自由选曲，上海赛不超过3分钟；总决赛不超过4分钟。</div><div>幼儿组：2012年5月31日（含）之后出生</div><div>学前组：2012年6月1日至2010年5月31日</div><div>儿童A组：2010年6月1日至2008年5月31日</div><div>儿童B组：2008年6月1日至2006年5月31日</div><div>儿童C组：2006年6月1日至2004年5月31日</div><div>少年A组：2004年6月1日至2002年5月31日</div><div>少年B组：2002年6月1日至2000年5月31日</div><div>少年C组：2000年6月1日至1997年5月31日</div><div>四手联弹初/中级组：4分钟以内自由选曲（两位选手年龄相加不能超过20岁）</div><div>汤姆森一级/二级：车尔尼599/849；一首巴洛克或古典时期的作品；儿童精选钢琴曲集I、II、III、IV程度之任何一首；</div><div>巴赫：【巴赫钢琴小曲集】第一册或【1725安娜玛格达琳娜钢琴曲集】之任何一首；</div><div>【两声部创意曲】任何一首；柴可夫斯基；任何一首【四季】任何一首【少年曲集】</div><div>中国作品初级组：</div><div>七夕银河、细诉、夜深沉、晓风之舞、春风竹笛、音画、节日舞、红狼当红军、小小竹排、小变奏曲、清清香江水、</div><div>绣金匾、迎亲人、牧童短笛、彩云追月（或任何一首4分钟内的中国钢琴作品）</div><div>中国作品中级组：</div><div>康定情歌、北风吹、洪湖水浪打浪、红头绳、对花、舞龙灯（或任何一首4分钟内的中国钢琴作品）</div><div>专业组组别及曲目</div><div><br></div><div>少年C组：2000年6月1日至1997年5月31日</div><div>青年A组：1997年6月1日至1994年5月31日</div><div>青年B组：1994年6月1日至1991年5月31日</div><div>青年C组：1991年6月1日至1986年5月31日</div><div>巴赫：巴赫任何一首</div><div>海顿：海顿任何一首奏鸣曲之快、急板</div><div>莫扎特：莫扎特第一或第三乐章</div><div>贝多芬：贝多芬任何一首奏鸣曲之一</div><div>舒伯特：舒伯特任何一首即兴曲</div><div>肖邦：肖邦叙事曲、肖邦夜曲、肖邦圆舞曲、玛祖卡舞曲、肖邦前奏曲、肖邦练习曲任何一首</div><div>李斯特：李斯特练习曲、李斯特自由选曲任何一首</div><div>德彪西：德彪西组任何一首（4分钟之内）</div><div>中国作品高级组</div><div>松花江上、平湖秋月、春江花月夜、浏阳河、洪湖水浪打浪、新疆舞曲、花鼓、二泉映月、山丹丹红艳艳、阳萧鼓、昭君怨四手联弹高级组及曲目：布拉姆任何一首【匈牙利舞曲】或德布西任何一首【小组曲】或莫扎特F小调幻想曲K608</div><div>钢琴教师演奏组及曲目：自由选曲各大音乐学院演奏文凭</div><div>参赛细则</div><div><br></div><div>1、参赛者必须按照各组别要求进行报名、按出生年月分组报名时必须提供有效证件复印件。</div><div>2、每位参赛者最多参加四个不同组别比赛；每个组别需独立填写报名表格、所填数据必须属实，如有违规取消比赛资格。</div><div>3、组委会现场提供三角钢琴一台；</div><div>4、比赛先后次序按组委会规定的程序决定，选手不可有任何异议；</div><div>5、组委会有必要时可将比赛时间调动，参赛者不可有异议；</div><div>6、参赛者及现场陪同者必须遵守大赛的有关规则。</div><div>7、参赛者已缴纳的报名费用将不予退还或转让他人。</div><div>8、如参赛者的演奏超时评委有权叫停演奏，不影响评分。</div><div>9、对以上比赛规则有异议者谢绝参加！</div><div>评委设置</div><div><br></div><div>&nbsp; &nbsp; &nbsp; &nbsp;1、上海邀请赛每场评委不少于两名评委，并具备专业等级职称一级；</div><div>&nbsp; &nbsp; &nbsp; &nbsp;2、总决赛每个组别及赛场国内外艺术家参加，每场不少于三名评委，要求具有国家一级职称；</div><div>&nbsp; &nbsp; &nbsp; &nbsp;3、本着“公平、公开、公正”的原则，严格执行评委准则。</div><div>奖项设置及晋级标准</div><div><br></div><div>评分实行一百分制各组别将评出以下奖项：</div><div>◆ 特等奖 95分以上（各年龄组别各一名，或空缺）</div><div>◆ 一等奖 90分—94分若干； 二等奖 80分—89分若干； 三等奖 70分—79分若干 ；优秀奖 65分—69分若干；</div><div>◆ 重要说明：特等奖；一等奖参赛选手的指导老师可获得【国际优秀导师奖】证书；</div><div>◆ 凡推荐30个参赛选手的艺术培训机构可获得【优秀组织奖】奖牌。</div><div>◆获得一、二、三等奖晋级总决赛。</div><div>◆所有选手必须认同评委的评审结果，不得有异议，否则将取消选手的参赛资格。</div><div>◆总决赛现场设有大师讲座，时间地点以现场通知为准。</div><div>总决赛获奖选手将荣获中国“优秀特长生评审学会”颁发的“中国优秀特长生”荣誉称号。</div><div>费用另行通知。&nbsp;</div><div>总决赛组委会为每位参加大赛的选手办理10万元人身意外保险</div><div>有效期1个月，100元以上启动理赔。</div><div>大赛组委会持有对本文件的最终解释权</div><div><br></div>', '2017.9.28', '2017.10.19', '16');

-- ----------------------------
-- Table structure for config
-- ----------------------------
DROP TABLE IF EXISTS `config`;
CREATE TABLE `config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `desc` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of config
-- ----------------------------
INSERT INTO `config` VALUES ('1', '学生调课次数', '2', '');
INSERT INTO `config` VALUES ('2', '教师调课次数', '5', '');
INSERT INTO `config` VALUES ('3', '非学员下载中心下载数量', '6', '');

-- ----------------------------
-- Table structure for course
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `courseDescription` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of course
-- ----------------------------
INSERT INTO `course` VALUES ('17', '钢琴1对1 ', '');
INSERT INTO `course` VALUES ('18', '钢琴1对1（60）', '');
INSERT INTO `course` VALUES ('19', '音乐素养1对1（30）', '');
INSERT INTO `course` VALUES ('20', '音乐素养课小组（a）', '');
INSERT INTO `course` VALUES ('21', '音乐素养小组（b）', '');
INSERT INTO `course` VALUES ('22', '声乐小组课（a）', '');
INSERT INTO `course` VALUES ('23', '钢琴陪练1对1（30）', '');
INSERT INTO `course` VALUES ('24', '钢琴陪练1对1（45）', '');
INSERT INTO `course` VALUES ('25', '钢琴陪练1对1（60）', '');
INSERT INTO `course` VALUES ('26', '四手联弹课', '');
INSERT INTO `course` VALUES ('27', '听力（1-3）', '');
INSERT INTO `course` VALUES ('28', '试听课1对1（30）', '');

-- ----------------------------
-- Table structure for course_table
-- ----------------------------
DROP TABLE IF EXISTS `course_table`;
CREATE TABLE `course_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacherId` int(11) NOT NULL,
  `termId` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of course_table
-- ----------------------------

-- ----------------------------
-- Table structure for course_table_detail
-- ----------------------------
DROP TABLE IF EXISTS `course_table_detail`;
CREATE TABLE `course_table_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `termId` int(11) NOT NULL,
  `teacherId` int(11) NOT NULL,
  `courseName` varchar(255) NOT NULL,
  `classroomId` int(11) NOT NULL,
  `dayOfWeek` varchar(255) NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `number` int(11) NOT NULL,
  `duration` int(11) NOT NULL,
  `level` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT '',
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `openEnrollment` varchar(255) NOT NULL,
  `clearCourse` varchar(255) NOT NULL,
  `remarks` varchar(60) DEFAULT NULL,
  `belowClass` int(11) NOT NULL,
  `numberOfRequests1` int(11) NOT NULL,
  `numberOfRequests2` int(11) NOT NULL,
  `teacherBelowClass` int(11) NOT NULL,
  `teacherNumberOfRequests1` int(11) NOT NULL,
  `teacherNumberOfRequests2` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of course_table_detail
-- ----------------------------
INSERT INTO `course_table_detail` VALUES ('5', '37', '14', '钢琴1对1 ', '13', '星期一', '06:30:00', '07:00:00', '1', '30', 'A', '', '2017-11-14', '2017-11-30', '是', '', '', '10', '2', '3', '8', '3', '4');

-- ----------------------------
-- Table structure for course_table_detail_student
-- ----------------------------
DROP TABLE IF EXISTS `course_table_detail_student`;
CREATE TABLE `course_table_detail_student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseTableDetailId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `termId` int(11) NOT NULL DEFAULT '1',
  `courseTableItem` text COMMENT '这个是停课的时间',
  `reasonsForSuspension` varchar(255) DEFAULT NULL,
  `classTransferCourseTableDetailId` int(11) DEFAULT NULL COMMENT '转班的iD',
  `originalCourseTableDetailId` int(11) DEFAULT NULL,
  `signUpCurriculumId` int(11) DEFAULT NULL COMMENT '报名课程的Id',
  `shiftReasons` varchar(255) DEFAULT NULL,
  `shiftStartDate` text,
  `numberOfChangeClass` int(11) NOT NULL,
  `allNumberOfChangeClass` int(11) NOT NULL,
  `numberOfleave` int(11) NOT NULL,
  `startCourseTableItemId` int(11) DEFAULT NULL,
  `numberOfChangeClassForTeacher` int(11) NOT NULL,
  `allNumberOfChangeClassForTeacher` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of course_table_detail_student
-- ----------------------------
INSERT INTO `course_table_detail_student` VALUES ('66', '5', '1', '正常', '37', null, null, null, null, '3', null, null, '2', '2', '2', null, '3', '3');

-- ----------------------------
-- Table structure for course_table_item
-- ----------------------------
DROP TABLE IF EXISTS `course_table_item`;
CREATE TABLE `course_table_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseTableDetailId` int(11) NOT NULL,
  `teacherId` int(11) NOT NULL,
  `date` date NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `classroomId` int(11) NOT NULL,
  `courseName` varchar(255) NOT NULL,
  `number` int(11) NOT NULL,
  `duration` int(11) NOT NULL,
  `level` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT '',
  `type` varchar(255) NOT NULL,
  `termId` int(11) NOT NULL DEFAULT '1',
  `updateTime` datetime NOT NULL,
  `createTime` datetime NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of course_table_item
-- ----------------------------
INSERT INTO `course_table_item` VALUES ('11', '5', '14', '2017-11-20', '06:30:00', '07:00:00', '13', '钢琴1对1 ', '1', '30', 'A', '', '正式课程', '37', '2017-11-14 13:09:17', '2017-11-14 11:50:40', null);
INSERT INTO `course_table_item` VALUES ('12', '5', '14', '2017-11-27', '06:30:00', '07:00:00', '13', '钢琴1对1 ', '1', '30', 'A', '', '正式课程', '37', '2017-11-14 13:09:17', '2017-11-14 11:50:40', null);

-- ----------------------------
-- Table structure for course_table_item_change_class
-- ----------------------------
DROP TABLE IF EXISTS `course_table_item_change_class`;
CREATE TABLE `course_table_item_change_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseTableDetailId` int(11) NOT NULL,
  `courseTableDetailItemId` int(11) NOT NULL,
  `reason` varchar(500) NOT NULL,
  `studentId` int(11) NOT NULL,
  `createTime` datetime NOT NULL,
  `one` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of course_table_item_change_class
-- ----------------------------

-- ----------------------------
-- Table structure for course_table_item_change_class_for_teacher
-- ----------------------------
DROP TABLE IF EXISTS `course_table_item_change_class_for_teacher`;
CREATE TABLE `course_table_item_change_class_for_teacher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseTableDetailStudentId` int(11) NOT NULL,
  `fromCourseTableItemId` int(11) NOT NULL,
  `toCourseTableItemId` int(11) NOT NULL,
  `reason` text NOT NULL,
  `one` int(11) NOT NULL,
  `teacherId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of course_table_item_change_class_for_teacher
-- ----------------------------

-- ----------------------------
-- Table structure for course_table_item_leave
-- ----------------------------
DROP TABLE IF EXISTS `course_table_item_leave`;
CREATE TABLE `course_table_item_leave` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseTableDetailId` int(11) NOT NULL,
  `courseTableDetailItemId` int(11) NOT NULL,
  `reason` varchar(500) NOT NULL,
  `studentId` int(11) NOT NULL,
  `createTime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of course_table_item_leave
-- ----------------------------

-- ----------------------------
-- Table structure for course_table_item_student
-- ----------------------------
DROP TABLE IF EXISTS `course_table_item_student`;
CREATE TABLE `course_table_item_student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseTableItemId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `teacherStatus` varchar(255) DEFAULT NULL,
  `termId` int(11) NOT NULL DEFAULT '1',
  `updateTime` datetime NOT NULL,
  `createTime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=685 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of course_table_item_student
-- ----------------------------
INSERT INTO `course_table_item_student` VALUES ('683', '11', '1', '正常', null, '37', '2017-11-14 13:09:17', '2017-11-14 13:09:17');
INSERT INTO `course_table_item_student` VALUES ('684', '12', '1', '正常', null, '37', '2017-11-14 13:09:17', '2017-11-14 13:09:17');

-- ----------------------------
-- Table structure for curriculum
-- ----------------------------
DROP TABLE IF EXISTS `curriculum`;
CREATE TABLE `curriculum` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `date` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of curriculum
-- ----------------------------

-- ----------------------------
-- Table structure for downloadpic
-- ----------------------------
DROP TABLE IF EXISTS `downloadpic`;
CREATE TABLE `downloadpic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL,
  `explain` text NOT NULL,
  `path` varchar(255) NOT NULL,
  `createTime` datetime NOT NULL,
  `updateTime` datetime NOT NULL,
  `mimeType` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of downloadpic
-- ----------------------------

-- ----------------------------
-- Table structure for exercise_video
-- ----------------------------
DROP TABLE IF EXISTS `exercise_video`;
CREATE TABLE `exercise_video` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(40) NOT NULL,
  `name` varchar(20) NOT NULL,
  `path` varchar(255) NOT NULL,
  `createTime` datetime NOT NULL,
  `updateTime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of exercise_video
-- ----------------------------

-- ----------------------------
-- Table structure for honor_roll
-- ----------------------------
DROP TABLE IF EXISTS `honor_roll`;
CREATE TABLE `honor_roll` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `introduce` varchar(255) NOT NULL,
  `createTime` datetime NOT NULL,
  `updateTime` datetime NOT NULL,
  `path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of honor_roll
-- ----------------------------

-- ----------------------------
-- Table structure for online_guide
-- ----------------------------
DROP TABLE IF EXISTS `online_guide`;
CREATE TABLE `online_guide` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL,
  `explain` text NOT NULL,
  `path` varchar(255) NOT NULL,
  `createTime` datetime NOT NULL,
  `updateTime` datetime NOT NULL,
  `mimeType` varchar(255) NOT NULL,
  `studentId` int(11) NOT NULL,
  `content` varchar(500) NOT NULL DEFAULT '',
  `teacherId` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of online_guide
-- ----------------------------

-- ----------------------------
-- Table structure for registration_payment_process
-- ----------------------------
DROP TABLE IF EXISTS `registration_payment_process`;
CREATE TABLE `registration_payment_process` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `signUupCurriculumId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of registration_payment_process
-- ----------------------------

-- ----------------------------
-- Table structure for renew
-- ----------------------------
DROP TABLE IF EXISTS `renew`;
CREATE TABLE `renew` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseDetailId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `times` varchar(500) NOT NULL,
  `state` varchar(255) NOT NULL,
  `termId` int(11) NOT NULL,
  `updateTime` datetime NOT NULL,
  `createTime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of renew
-- ----------------------------

-- ----------------------------
-- Table structure for reset_curriculum_cycle
-- ----------------------------
DROP TABLE IF EXISTS `reset_curriculum_cycle`;
CREATE TABLE `reset_curriculum_cycle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseTableDetailId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `startDateId` int(11) NOT NULL,
  `endDateId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of reset_curriculum_cycle
-- ----------------------------
INSERT INTO `reset_curriculum_cycle` VALUES ('14', '83', '20', '878', '889');

-- ----------------------------
-- Table structure for rhythmcourse
-- ----------------------------
DROP TABLE IF EXISTS `rhythmcourse`;
CREATE TABLE `rhythmcourse` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `time` varchar(20) NOT NULL,
  `courseIntroduction` text NOT NULL,
  `category` varchar(20) NOT NULL,
  `picId` int(11) DEFAULT NULL,
  `creatTime` varchar(20) NOT NULL,
  `updateTime` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of rhythmcourse
-- ----------------------------
INSERT INTO `rhythmcourse` VALUES ('1', '钢琴课', '每节课30分钟', '多年前，美国钢琴家、作曲家、音乐教育家、作家简•史密瑟•巴斯蒂安创立了“巴斯蒂安钢琴教育体系”，她编写的钢琴教程图文并茂，以快乐教育为指导思想，采用循序渐进的多调性教学法，让学生在弹奏多种调性乐曲的过程中，掌握完整的键盘知识，并且从中学习各种基础的节奏类型、音程、和弦、音阶、音乐记号和术语。其教程分为五级，每一级含《基础》、《乐理》、《技巧》、《演奏》与《视奏》，各教程配合使用，便于系统、完整、全方位地同步学习，为学生掌握每一阶段的音乐基本概念提供了最完整的材料，深受世界各国教师和儿童们的喜爱。<div><img src=\"https://wx.yinmanyinyue.com/public/files/171019/20171019134445259.jpg\"><br></div>', '1对1个人课', '7', '2017.9.28', '2017.10.19');
INSERT INTO `rhythmcourse` VALUES ('2', '声乐课', '每节课60分钟', '国内独家引进由牛津大学出版的《voiceworks》系列声乐教程，附加著名中国儿童歌曲及部分适合孩子演唱的流行歌曲，多种类型的歌曲选择。根据不同年龄段特点，通过参加有序的组织小组活动，包括声音的游戏、声音的热身、歌曲故事、歌词创作等趣味环节，让孩子们学会了倾听、分享、敢于创造及尊重他人。他们唱歌和创作音乐,有助于获得良好的乐感、节奏感,并且学习如何自信地展示声音。这些音乐和社会技能成为终身学习的基础。<div><img src=\"https://wx.yinmanyinyue.com/public/files/171019/20171019134459578.jpg\"><br></div>', '1对4-8小班制教学', '10', '2017.9.28', '2017.10.19');
INSERT INTO `rhythmcourse` VALUES ('3', '音乐素养', '每节课30—60分钟', '<div>一、课程内容</div><div><br></div><div>视唱练耳：视唱练耳英文叫作sign-singing and ear-training,也就是看着谱子演唱和耳朵训练,我们简称为“视唱练耳”。单从字面上来理解,就是看谱即唱和听觉的训练,但我们不能只从字面上来理解,其实它是一门综合性的音乐训练科目,包括乐理、听觉练习、视唱练习和节奏练习,是科学训练小孩头脑反应,提高听力乐感的美育课,通过学习使少儿听觉敏锐,唱音美好,否则一旦耳骨长成型,就较难纠正和提高。视唱课又是学习声乐、器乐课的很好的辅助课。练耳是学习音乐(声乐、器乐)必要的功课,学习视唱练耳和乐理等音乐基础知识会更好的促进器乐的学习,乐感提高了,学习专业时就会省时省力,事半功倍。视唱练耳,节拍、旋律等的训练,同时还应该包括对音乐的感知、理解和表达等综合性音乐素养的练习。</div><div>乐理：音乐理论是一切音乐学习的基础。更加系统的学习乐理，可以有效的反哺各种音乐学习。从简单的认音识谱，到进阶的乐谱分析，一直到乐曲创作。都需要乐理知识的积淀作为基础。</div><div>欣赏：将视唱练耳及乐理综合在一起，才能够真正学会如何欣赏一首乐曲。视唱练耳带来“会听”，乐理带来了“能懂”，让孩子不再只是单纯的“听音乐”而是能够“懂音乐”。</div><div><br></div><div><div>二、教学训练内容</div><div><br></div><div>内容</div><div>1.乐理。包括音程,和弦,调式,记谱法等知识。</div><div>2.听觉练习。通过单音的模唱和听辨、音组的模唱和听辨,以及音程、音乐短句的听辨,提高和发展学习者的音乐</div><div>3.节奏练习。节奏是构成音乐要素之一,在这项训练中,通过读节奏、说念歌谣,以及节奏模仿、节奏选择、节奏听写方面的练习,可训练和提高学习者的模仿能力、反应能力和音乐记忆能力,丰富多样的节奏训练形式能极大地调动和增强学习者的音乐学习兴趣。</div><div>4.视唱练习。这项训练是和听觉练习相互结合相互补充的一项训练内容。通过对大量优秀的中外儿歌、民歌,以及名曲片段的视谱演唱,使学习者逐步提高视谱能力,同时,通过演唱,可达到积累丰富的音乐语汇的目的。</div></div><div><img src=\"https://wx.yinmanyinyue.com/public/files/171019/20171019134511465.jpg\"><br></div><div><br></div>', '1对2-8小班制教学', '12', '2017.9.28', '2017.10.19');

-- ----------------------------
-- Table structure for school_transfer_course
-- ----------------------------
DROP TABLE IF EXISTS `school_transfer_course`;
CREATE TABLE `school_transfer_course` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nTermId` int(11) NOT NULL,
  `iClassSchedulingTime` varchar(255) NOT NULL,
  `iMakeupTime` varchar(255) NOT NULL,
  `iReason` varchar(255) NOT NULL,
  `createTime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of school_transfer_course
-- ----------------------------

-- ----------------------------
-- Table structure for sign_up_curriculum
-- ----------------------------
DROP TABLE IF EXISTS `sign_up_curriculum`;
CREATE TABLE `sign_up_curriculum` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentId` int(11) NOT NULL,
  `curriculumId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `state` varchar(255) NOT NULL,
  `createTime` varchar(20) NOT NULL,
  `specialRequirements` text,
  `changeCurriculumId` int(11) DEFAULT NULL,
  `reviewRemarks` text,
  `paymentMethod` varchar(30) DEFAULT NULL,
  `afterCourseDeleTeSaveInfo` text COMMENT '为了防止取消删除后存储的信息',
  `startCourseTableItemId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of sign_up_curriculum
-- ----------------------------
INSERT INTO `sign_up_curriculum` VALUES ('3', '1', '5', '109', '已确认', '2017-11-14 13:09', '', null, '11', '现金', '{\"id\":5,\"termId\":37,\"teacherId\":14,\"courseName\":\"钢琴1对1 \",\"classroomId\":13,\"dayOfWeek\":\"星期一\",\"startTime\":\"06:30:00\",\"endTime\":\"07:00:00\",\"number\":1,\"duration\":30,\"level\":\"A\",\"status\":\"\",\"startDate\":\"2017-11-13T16:00:00.000Z\",\"endDate\":\"2017-11-29T16:00:00.000Z\",\"openEnrollment\":\"是\",\"clearCourse\":\"\",\"remarks\":\"\",\"belowClass\":10,\"numberOfRequests1\":2,\"numberOfRequests2\":3,\"teacherBelowClass\":8,\"teacherNumberOfRequests1\":3,\"teacherNumberOfRequests2\":4,\"oTeacher\":{\"id\":14,\"userId\":110,\"name\":\"天天牛-VIP 专线\",\"identityCategory\":\"\",\"sex\":\"男\",\"dateOfBirth\":\"2017-11-13\",\"phoneNumber\":\"13133333333\",\"professorCourse\":null,\"createTime\":\"2017-11-13T10:43:50.000Z\",\"upDateTime\":\"2017-11-13T10:43:58.000Z\"},\"oClassroom\":{\"id\":13,\"name\":\"三楼北\",\"date\":\"1509537906455\",\"isPiano\":1},\"term\":{\"id\":37,\"name\":\"第一学期\",\"startDate\":\"2017-11-13T16:00:00.000Z\",\"endDate\":\"2017-11-29T16:00:00.000Z\",\"isDelete\":0,\"belowClass\":10,\"numberOfRequests1\":2,\"numberOfRequests2\":3,\"teacherBelowClass\":8,\"teacherNumberOfRequests1\":3,\"teacherNumberOfRequests2\":4},\"curriculum\":{\"id\":17,\"name\":\"钢琴1对1 \",\"courseDescription\":\"\"}}', '0');

-- ----------------------------
-- Table structure for sign_up_curriculum_time
-- ----------------------------
DROP TABLE IF EXISTS `sign_up_curriculum_time`;
CREATE TABLE `sign_up_curriculum_time` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sign_up_curriculum_id` int(11) NOT NULL,
  `arrayDay` varchar(20) NOT NULL,
  `indexDay` tinyint(4) NOT NULL,
  `timeStart` varchar(20) NOT NULL,
  `timeEnd` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of sign_up_curriculum_time
-- ----------------------------

-- ----------------------------
-- Table structure for sign_up_wetchat
-- ----------------------------
DROP TABLE IF EXISTS `sign_up_wetchat`;
CREATE TABLE `sign_up_wetchat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseTableDetailStudentId` int(11) NOT NULL,
  `isSend` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sign_up_wetchat
-- ----------------------------
INSERT INTO `sign_up_wetchat` VALUES ('1', '65', '0');
INSERT INTO `sign_up_wetchat` VALUES ('2', '66', '0');

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `sex` varchar(4) NOT NULL,
  `school` varchar(30) NOT NULL,
  `parentName` varchar(20) NOT NULL,
  `telephone` varchar(11) NOT NULL,
  `address` varchar(60) NOT NULL,
  `basics` varchar(10) NOT NULL DEFAULT '',
  `introduceBaby` varchar(255) NOT NULL DEFAULT '',
  `userId` int(11) NOT NULL,
  `createTime` datetime NOT NULL DEFAULT '2017-01-01 00:00:00',
  `updateTime` datetime NOT NULL DEFAULT '2017-01-01 00:00:00',
  `booking` tinyint(2) NOT NULL DEFAULT '0',
  `sign_up` tinyint(2) NOT NULL DEFAULT '0',
  `dateOfBirth` date NOT NULL DEFAULT '2017-01-01',
  `hasCourseTable` tinyint(2) NOT NULL DEFAULT '0' COMMENT '已有课程',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of student
-- ----------------------------
INSERT INTO `student` VALUES ('1', 'qiao', '男', '扬大', '乔', '13133333333', '江苏', '0基础', '', '109', '2017-11-14 10:23:54', '2017-11-14 10:23:54', '0', '1', '2017-11-14', '0');

-- ----------------------------
-- Table structure for student_comment
-- ----------------------------
DROP TABLE IF EXISTS `student_comment`;
CREATE TABLE `student_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacherId` int(11) NOT NULL,
  `courseDetailId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `comment` varchar(500) CHARACTER SET utf8mb4 NOT NULL,
  `createTime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of student_comment
-- ----------------------------

-- ----------------------------
-- Table structure for suspension_refund
-- ----------------------------
DROP TABLE IF EXISTS `suspension_refund`;
CREATE TABLE `suspension_refund` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseTableDetailId` int(11) NOT NULL,
  `accountName` varchar(30) NOT NULL,
  `desc` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `studentId` int(11) NOT NULL,
  `paymentNo` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of suspension_refund
-- ----------------------------

-- ----------------------------
-- Table structure for teacher
-- ----------------------------
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `identityCategory` varchar(255) NOT NULL,
  `sex` varchar(255) NOT NULL,
  `dateOfBirth` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `professorCourse` varchar(255) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `upDateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of teacher
-- ----------------------------
INSERT INTO `teacher` VALUES ('5', '142', '音曼音乐课堂', '', '女', '1985-11-15', '13524160481', null, '2017-11-02 11:36:46', '2017-11-02 11:38:02');
INSERT INTO `teacher` VALUES ('6', '140', '王静雪', '', '女', '1985-11-15', '13524160481', null, '2017-11-02 11:38:21', '2017-11-02 11:39:18');
INSERT INTO `teacher` VALUES ('7', '141', '王静文', '', '女', '1985-12-31', '13564281815', null, '2017-11-02 11:40:51', '2017-11-02 11:41:38');
INSERT INTO `teacher` VALUES ('8', '157', '徐洋', '', '女', '1992-11-4', '15900908771', null, '2017-11-02 16:02:02', '2017-11-02 16:02:56');
INSERT INTO `teacher` VALUES ('9', '158', '吴婷', '', '女', '1990-4-12', '15221928289', null, '2017-11-02 16:03:18', '2017-11-02 16:06:30');
INSERT INTO `teacher` VALUES ('10', '166', '孔虹美', '', '女', '1990-9-15', '13661607343', null, '2017-11-03 11:09:38', '2017-11-03 11:26:55');
INSERT INTO `teacher` VALUES ('11', '167', '佘瑞祺', '', '女', '1997-7-16', '15056217186', null, '2017-11-03 11:14:04', '2017-11-03 11:15:01');
INSERT INTO `teacher` VALUES ('12', '169', '吴晓艇', '', '女', '1997-11-25', '18259373166', null, '2017-11-03 11:19:30', '2017-11-03 11:19:55');
INSERT INTO `teacher` VALUES ('13', '164', '松', '', '女', '1986-2-4', '13916292747', null, '2017-11-03 11:30:13', '2017-11-03 11:30:56');
INSERT INTO `teacher` VALUES ('14', '110', '天天牛-VIP 专线', '', '男', '2017-11-13', '13133333333', null, '2017-11-13 18:43:50', '2017-11-13 18:43:58');

-- ----------------------------
-- Table structure for teacher_nitroduction
-- ----------------------------
DROP TABLE IF EXISTS `teacher_nitroduction`;
CREATE TABLE `teacher_nitroduction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `sex` varchar(10) NOT NULL,
  `education` varchar(255) NOT NULL,
  `major` varchar(60) NOT NULL,
  `school` varchar(60) NOT NULL,
  `teachingSubjects` varchar(60) NOT NULL,
  `professionalExperience` text NOT NULL,
  `creatTime` varchar(20) NOT NULL,
  `updateTime` varchar(20) DEFAULT NULL,
  `picId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of teacher_nitroduction
-- ----------------------------
INSERT INTO `teacher_nitroduction` VALUES ('1', '小王老师', '女', '硕士研究生', '声乐 钢琴 音乐素养课', '上海音乐学院', '声乐 钢琴 音乐素养课', '<div>自1995年开始学习钢琴，声乐。先后师从于山东师范大学音乐学院声乐系主任丁汝燕，华东师范大学青年女歌唱家许洁，上海音乐学院副教授陈剑波，教授郑倜学习声乐。师从旅英青年演奏家陈默学习钢琴，华东师范大学钢琴教研主任张薇学习钢琴即兴伴奏，师从台湾著名教育学者姜旼学习音乐教学法。有扎实的弹唱功底。04年以优异的成绩考入华东师范大学音乐教育系，主修声乐辅修钢琴。在校期间一直享有专业奖学金。09年以优异的成绩考入上海音乐学院攻读声乐表演研究生。在校期间一直享有专业奖学金，举办两场个人独唱音乐会，广受好评。多次在上海大剧院，贺绿汀音乐厅，上海音乐厅演出。曾赴厦门参加国际奥林匹克歌唱比赛获青年混声组金奖。</div><div>自入校便从事钢琴、声乐教育工作，至今已经有9年的教学经历，教授过的学生过百，积累了丰富的教学经验。多年来更潜心研究小汤姆森，巴斯蒂安，快乐钢琴，菲博尔、voiceplay等多种启蒙教材的教学体系教学思路，授课教材及方式灵活，针对每个学生不同的发展和自身条件进行施教。 对于音乐普及教育有独到的见解，重视素质培养，以提高学生兴趣为学习的动力。让学生通过音乐的学习，认识音乐了解音乐喜欢音乐，激发学生的潜能。重视乐感的培养，同时在技巧上也进行规范的练习，养成良好的练习习惯。不要求学生每日练习很久，但要求提高学习效率，持之以恒。&nbsp;</div><div>旨在培养爱好，丰富生活，激发潜力。而非以考级为目标。针对考级，绝不赞成恶性拔高。而根据学生的实际水平，可以考级作为展示的平台。随着英国皇家考级进入中国大陆，多年来，学生更多的是通过英国皇家的考级。对于英国皇家考级，可谓积累了丰富的经验和心得。同时也更加推崇这一科学的考级体制。培养的声乐学生，可以把握多曲风歌曲，具有极强的音乐表现力，很多学员考入上海著名少儿合唱团 。</div><div><img src=\"https://wx.yinmanyinyue.com/public/files/171019/20171019134321628.jpg\"><br></div><div><br></div>', '2017.9.28', '2017.11.3', '65');
INSERT INTO `teacher_nitroduction` VALUES ('2', '大王老师', '男', '本科', '钢琴', '华东师范大学', '钢琴 音乐素养课', '<div>自1994年开始学习钢琴，先后师从于山东师范大学音乐学院院长留女同教授、山东大学音乐学院院长侯康为教授及华东师范大学艺术学院院长、终身教授、著名钢琴家、指挥家侯润宇教授。5年即考出钢琴十级，从小学阶段起便先后获得过多次省市级钢琴比赛的一等奖或特等奖，多次以获奖者身份在颁奖典礼上独奏。2006年以优异的成绩考入华东师范大学艺术学院音乐系音乐教育专业，主修钢琴副修声乐。在大学阶段，钢琴演奏水平再次得到质的提高，受到老师的好评。而且由于专业的突出，于毕业时开办独奏音乐会，广受好评。并且经常被邀请参加声乐、歌剧演出及管弦乐的排练工作。&nbsp;</div><div>自2005年暑假起便开始钢琴教育工作，手下带出的学生包含了自幼儿启蒙到成人兴趣爱好以及为了幼师专项考试等诸多方面。每年组织学员举办音乐会，让学员在实践中锻炼自我。自05年至今，保持钢琴业余考级以及英国皇家音乐学院钢琴考级通过率100%的好成绩。经过多年的教学以后又仔细学习、研究了国外的先进钢琴教学体系以及方法，采用巴斯蒂安教程，形成了一套独特的、孩子们喜欢的钢琴教学方式。擅长幼儿钢琴启蒙、钢琴高等级的提高以及成人兴趣爱好的培训。除钢琴教学以外，还参加过多次商业演出及演出前培训、排练工作。&nbsp;</div><div>一，总结出“弹、知、听、想、作”五点教学重点，注重全面的能力培养，不再做“乐谱复读机”。&nbsp;</div><div>二，“大、小”结合的双课模式，让孩子科学、系统的学习钢琴。&nbsp;</div><div>三，强调有情感的演奏，摆脱枯燥的练习，让每一首乐曲都能够弹的“好听”。&nbsp;</div><div>四，上课采用多样化教学形式和教具，增强学习的趣味性。&nbsp;</div><div>五，为孩子提供大量的演奏实践机会，每年固定的音乐会、不规定的音乐沙龙与比赛，让孩子在表现自我中成长。&nbsp;</div><div>六，强调即兴创作与演奏相结合，体现了音乐的应用性。让音乐与钢琴真正的融入于生活之中。</div><div><img src=\"https://wx.yinmanyinyue.com/public/files/171019/2017101913434774.jpg\"><br></div>', '2017.9.28', '2017.11.2', '2');
INSERT INTO `teacher_nitroduction` VALUES ('3', '佘老师', '女', '本科', '钢琴', '华东师范大学', '钢琴 音乐素养', '<div>自幼学习音乐，天赋异禀，5岁学习钢琴，十岁过音协十级，毕业于华东师范大学音乐系，钢琴专业。师从华东师范大学音乐系的沪上钢琴世家名门吴觸衡老师。</div><div>2007年获得全国技能大赛钢琴专业一等奖。</div><div>参加海伦杯钢琴比赛获得金奖</div><div>参加安徽省艺术大赛获得金奖</div><div>参加施坦威全国钢琴大赛获得一等奖。</div><div>参加星海杯全国钢琴比赛安徽赛区二等奖。</div><div>指导学生参加第四，六，七届香港国际钢琴公开赛被授予“优秀指导教师；</div><div>指导学生参加第十届华人青少年艺术节被授予“优秀指导教师”</div><div>对孩子遵从一切从兴趣出发，一切从专业出发的原则，为每个孩子制定学习计划，帮助孩子一步一步的完成自己的小目标，使孩子获得自信心，提高孩子们对音乐的鉴赏能力以及音乐的综合素养，令孩子们提高情商成为优秀的人。</div><div><img src=\"https://wx.yinmanyinyue.com/public/files/171019/20171019134357822.jpg\"><br></div>', '2017.9.28', '2017.11.2', '3');
INSERT INTO `teacher_nitroduction` VALUES ('4', '杨老师', '女', '研究生', '钢琴', '德国莱比锡门德尔松音乐与戏剧学院', '钢琴 音乐素养', '<div>青年旅德优秀声乐艺术指导，毕业于德国莱比锡门德尔松音乐与戏剧学院艺术指导与指挥系。师从于德国著名声乐艺术指导、艺术歌曲伴奏Hartmut Hudezeck教授。曾受聘于浙江师范大学音乐学院担任艺术指导，现任上海歌剧院钢琴伴奏。</div><div>在上海歌剧院期间，担任《早春二月》、《赌命》等大型演出的钢琴伴奏工作；与杭州爱乐乐团艺术总监兼首席指挥杨洋合作，作为唯一钢琴伴奏参与威尔第弥撒作品《安魂曲》的排练，在“月之故乡”市级机关文化沙龙歌剧鉴赏专场中担任钢琴伴奏，任意大利著名声乐教育家Valerio Paperi、吕怡慧声乐大师班伴奏，在秋的思念-中外经典合唱音乐会中担任首席伴奏。同时，曾于2015年参加第四届全国高校音乐教育专业声乐比赛，荣获优秀伴奏奖。</div><div>在旅德期间，担任歌剧《穿靴子的猫》、《贾尼·斯基基》歌剧排练伴奏工作，并作为钢琴伴奏版歌剧演奏者参与全部演出，获得当地媒体一致好评； 作为唯一钢琴演奏及伴奏者参与莱比锡格里格音乐节活动。并且担任《魔笛》、《蝙蝠》、《费加罗的婚礼》、《艺术家生涯》、《自由射手》、《茶花女》等歌剧排练伴奏工作。</div><div>同时，曾经获得非欧盟奖学金德国学术交流（DAAD）奖学金，上海市优秀毕业生，国家奖学金等多项荣誉。</div><div><img src=\"https://wx.yinmanyinyue.com/public/files/171019/2017101913449909.JPG\"><br></div>', '2017.9.28', '2017.11.3', '66');

-- ----------------------------
-- Table structure for term
-- ----------------------------
DROP TABLE IF EXISTS `term`;
CREATE TABLE `term` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `isDelete` tinyint(1) NOT NULL DEFAULT '0',
  `belowClass` int(11) NOT NULL,
  `numberOfRequests1` int(11) NOT NULL,
  `numberOfRequests2` int(11) NOT NULL,
  `teacherBelowClass` int(11) NOT NULL,
  `teacherNumberOfRequests1` int(11) NOT NULL,
  `teacherNumberOfRequests2` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of term
-- ----------------------------
INSERT INTO `term` VALUES ('37', '第一学期', '2017-11-14', '2017-11-30', '0', '10', '2', '3', '8', '3', '4');

-- ----------------------------
-- Table structure for upload
-- ----------------------------
DROP TABLE IF EXISTS `upload`;
CREATE TABLE `upload` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `picPath` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of upload
-- ----------------------------
INSERT INTO `upload` VALUES ('1', 'public/files/201792893827860.JPG');
INSERT INTO `upload` VALUES ('2', 'public/files/201792893936347.jpg');
INSERT INTO `upload` VALUES ('3', 'public/files/201792894853149.jpg');
INSERT INTO `upload` VALUES ('4', 'public/files/201792894929721.jpg');
INSERT INTO `upload` VALUES ('5', 'public/files/201792895043524.JPG');
INSERT INTO `upload` VALUES ('6', 'public/files/170928/201792895156308.jpg');
INSERT INTO `upload` VALUES ('7', 'public/files/2017112151519497.jpg');
INSERT INTO `upload` VALUES ('8', 'public/files/170928/201792895256116.jpg');
INSERT INTO `upload` VALUES ('9', 'public/files/170928/2017928953577.jpg');
INSERT INTO `upload` VALUES ('10', 'public/files/20179289536550.jpg');
INSERT INTO `upload` VALUES ('11', 'public/files/170928/201792895422761.jpg');
INSERT INTO `upload` VALUES ('12', 'public/files/201792895423971.jpg');
INSERT INTO `upload` VALUES ('13', 'public/files/170928/2017928102620101.jpg');
INSERT INTO `upload` VALUES ('14', 'public/files/2017928102622818.jpg');
INSERT INTO `upload` VALUES ('15', 'public/files/170928/2017928102720612.jpg');
INSERT INTO `upload` VALUES ('16', 'public/files/2017928102722985.jpg');
INSERT INTO `upload` VALUES ('17', 'public/files/170928/20179281030340.jpg');
INSERT INTO `upload` VALUES ('18', 'public/files/170928/2017928103028302.jpg');
INSERT INTO `upload` VALUES ('19', 'public/files/170928/2017928103044237.jpg');
INSERT INTO `upload` VALUES ('20', 'public/files/170928/2017928103054386.jpg');
INSERT INTO `upload` VALUES ('21', 'public/files/170928/201792810313763.JPG');
INSERT INTO `upload` VALUES ('22', 'public/files/170928/2017928103133906.jpg');
INSERT INTO `upload` VALUES ('23', 'public/files/171019/20171019134152394.png');
INSERT INTO `upload` VALUES ('24', 'public/files/171019/201710191342077.jpg');
INSERT INTO `upload` VALUES ('25', 'public/files/171019/20171019134321628.jpg');
INSERT INTO `upload` VALUES ('26', 'public/files/171019/2017101913434774.jpg');
INSERT INTO `upload` VALUES ('27', 'public/files/171019/20171019134357822.jpg');
INSERT INTO `upload` VALUES ('28', 'public/files/171019/2017101913449909.JPG');
INSERT INTO `upload` VALUES ('29', 'public/files/171019/20171019134445259.jpg');
INSERT INTO `upload` VALUES ('30', 'public/files/171019/20171019134459578.jpg');
INSERT INTO `upload` VALUES ('31', 'public/files/171019/20171019134511465.jpg');
INSERT INTO `upload` VALUES ('32', 'public/files/171019/20171019134554481.jpg');
INSERT INTO `upload` VALUES ('33', 'public/files/171019/2017101913467401.jpg');
INSERT INTO `upload` VALUES ('34', 'public/files/20171121523685.jpg');
INSERT INTO `upload` VALUES ('35', 'public/files/201711215237204.jpg');
INSERT INTO `upload` VALUES ('36', 'public/files/201711215237209.jpg');
INSERT INTO `upload` VALUES ('37', 'public/files/201711215238794.jpg');
INSERT INTO `upload` VALUES ('38', 'public/files/201711215243318.jpg');
INSERT INTO `upload` VALUES ('39', 'public/files/201711215555965.jpg');
INSERT INTO `upload` VALUES ('40', 'public/files/201711215617728.jpg');
INSERT INTO `upload` VALUES ('41', 'public/files/201711215628981.jpg');
INSERT INTO `upload` VALUES ('42', 'public/files/201711215636625.jpg');
INSERT INTO `upload` VALUES ('43', 'public/files/201711215644857.jpg');
INSERT INTO `upload` VALUES ('44', 'public/files/201711215645265.jpg');
INSERT INTO `upload` VALUES ('45', 'public/files/201711215646105.jpg');
INSERT INTO `upload` VALUES ('46', 'public/files/201711215648259.jpg');
INSERT INTO `upload` VALUES ('47', 'public/files/201711215648366.jpg');
INSERT INTO `upload` VALUES ('48', 'public/files/201711215648368.jpg');
INSERT INTO `upload` VALUES ('49', 'public/files/201711215648474.jpg');
INSERT INTO `upload` VALUES ('50', 'public/files/201711215714626.jpg');
INSERT INTO `upload` VALUES ('51', 'public/files/201711215715646.jpg');
INSERT INTO `upload` VALUES ('52', 'public/files/2017112151439646.jpg');
INSERT INTO `upload` VALUES ('53', 'public/files/2017112151441258.jpg');
INSERT INTO `upload` VALUES ('54', 'public/files/171102/2017112151941624.jpg');
INSERT INTO `upload` VALUES ('55', 'public/files/171102/2017112152020821.jpg');
INSERT INTO `upload` VALUES ('56', 'public/files/2017112152022717.jpg');
INSERT INTO `upload` VALUES ('57', 'public/files/171102/2017112152024595.jpg');
INSERT INTO `upload` VALUES ('58', 'public/files/201711215205276.jpg');
INSERT INTO `upload` VALUES ('59', 'public/files/2017112152456855.jpg');
INSERT INTO `upload` VALUES ('60', 'public/files/2017112152518912.jpg');
INSERT INTO `upload` VALUES ('61', 'public/files/2017112152520888.jpg');
INSERT INTO `upload` VALUES ('62', 'public/files/2017112153948400.jpg');
INSERT INTO `upload` VALUES ('63', 'public/files/2017112153950237.jpg');
INSERT INTO `upload` VALUES ('64', 'public/files/201711391920736.jpg');
INSERT INTO `upload` VALUES ('65', 'public/files/20171139192247.jpg');
INSERT INTO `upload` VALUES ('66', 'public/files/201711391933604.jpg');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wxHead` varchar(255) DEFAULT NULL,
  `wxName` varchar(255) DEFAULT NULL,
  `openId` varchar(255) DEFAULT NULL,
  `unionid` varchar(255) DEFAULT NULL,
  `publicOpenId` varchar(255) DEFAULT NULL,
  `state` int(11) NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `isDisable` tinyint(2) DEFAULT NULL,
  `sex` tinyint(2) DEFAULT NULL,
  `attentionTime` varchar(20) DEFAULT NULL,
  `lastInteraction` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=183 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('109', 'https://wx.qlogo.cn/mmopen/vi_32/RWib8FCKWu7d78sU05kCKAaYBTibIkmQT2p3u7U5ZLxzGLYTYwya8xK5TCXAkt9CMWECSNFaJ0KfEQO0H68CS8ww/0', '乔', 'oH5wb0Zxx1y6a0ZNgDw7wifa4iY0', 'ocVDd1Aq4f4NY3iwcIzX3JudVLMY', 'oKA9kwBAMXHyZMNg1a91a241c-MQ', '1', '', '0', '1', '2017-10-17 18:56:16', '2017-11-14 10:22:38');
INSERT INTO `user` VALUES ('110', 'https://wx.qlogo.cn/mmopen/vi_32/wR33nxGW1MwoOO9MNHxcD4C6Oz3QzvlNBvZzDMbKRmEVQHb1JEiaRpGHdMVU8Ul6ib1UOgC4b7iaJysIe2Y0ks8rQ/0', '天天牛-VIP 专线', 'oH5wb0eAVyiCIXOW4I8lDsVkMBBA', 'ocVDd1Ku7hcWweTa36XIxCs1d8fA', 'oKA9kwEaw7HVMVvpyM02K8g29w3k', '2', '', '0', '2', '2017-10-17 19:05:57', '2017-11-08 18:43:04');
INSERT INTO `user` VALUES ('111', 'https://wx.qlogo.cn/mmopen/vi_32/Q3auHgzwzM7VXh9YiaLfEVD5GBBkxpTIKfVEkgRB45Z8XYRZak3NUh9NSupaGVVnA1Z5kdK1icUdCGNXWRoGoMnw/0', 'Andy', 'oH5wb0VMgMQqhD5W40-6hF0e4S78', 'ocVDd1G-8SYY8az5S_3Op6kKZKeI', 'oKA9kwOsBhwLRuv--O5drVWWbDS8', '1', '', '0', '1', '2017-10-18 09:03:59', '2017-10-18 09:04:00');
INSERT INTO `user` VALUES ('112', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIV72kkInecZ08zWpfWcJf7jKib3HO8Q73q2ZVRmlSwYM4Ge17dEA2mz4QB8YvE7Onx1sWDltRNuPw/0', '豆豆猪', 'oH5wb0Yv0MJQJhrGWVKmKle6IgwE', 'ocVDd1Pn7GLBve3LlATn7MlO3_2M', 'oKA9kwKQULiCFxMIPLpPlHujbqIs', '1', '', '0', '2', '2017-10-18 09:08:50', '2017-11-10 17:29:19');
INSERT INTO `user` VALUES ('115', 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoBSnxW0mW9AMsnys68IgmwnYGwVHMyS7TRfmDj6LkF1FRV2PVlybPuhENqreysZAoaH3Dib1gr8mQ/0', '助手君', 'oH5wb0YY_6uUuI5yMzyWktzgEtQQ', 'ocVDd1O_dqgShncAkfQiJdq_RVlk', 'oKA9kwErfNX0o_lqLfyM5UI4hjrI', '1', '', '0', '0', '2017-10-19 13:14:37', '2017-11-10 16:19:11');
INSERT INTO `user` VALUES ('116', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL8nR7kBpJIFVPDuHkxAq0AG5x06ZtrHQPUK2thgQXvoc8ss4wL4bleibKyBTN58TI1IMDG3NwOj6A/0', 'sten123', 'oH5wb0eHzuMg6M5mJRXRCSQsd5Co', 'ocVDd1P2osRKu74QahlHvWciUIZ0', 'oKA9kwAgvGqmhoPnoaez7flPiyUY', '1', '', '0', '2', '2017-10-19 13:17:25', '2017-10-30 09:39:35');
INSERT INTO `user` VALUES ('117', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJGrDY3cRGPxOjPNK8hbhJAqgyiajwjZkicDkoqhm7ia7eb5ibKZeau6HibbgSNYP1m0IibsrqVibAdcgICQ/0', '随遇而安_Yuki', 'oH5wb0Rh7AwNQs7tm_rufJ4HvFWw', 'ocVDd1JmeqBCv3f9CuHQ5NyinZuI', 'oKA9kwFbHQz2mOQbkPyNLp_OQokw', '1', '', '0', '2', '2017-10-19 13:22:36', '2017-11-03 15:21:18');
INSERT INTO `user` VALUES ('120', 'http://wx.qlogo.cn/mmopen/gwhELYibibFdRI0tmMeQ6KW6QEJ6SB5YVhSLZaJW1YzR7DV7960rm5plIReOXziayZVWmribjNfvyaPaQR0pmc4odw/0', 'AuNa娜', '', 'ocVDd1Cs5bOw6H1r8uA-wjYdoweI', 'oKA9kwCRt3QqX6QCz2QNuSB2CQt4', '1', '', '0', '2', '2017-10-20 17:16:00', '2017-10-20 17:16:00');
INSERT INTO `user` VALUES ('121', 'http://wx.qlogo.cn/mmopen/gHj3DVcFxSwcRnLzziaDeaASjS7OtdXX0qBfDheCPBNFGKtld1hH63zeviaC97bVJc8EV03iabCht2fqVhStmPmtQ/0', '小正哥', '', 'ocVDd1EaqnD0Ho2mvxl6I2nOgdl8', 'oKA9kwE7QxNnCVqSwUPlGvrxjIa8', '1', '', '0', '1', '2017-10-20 17:16:00', '2017-10-20 17:16:00');
INSERT INTO `user` VALUES ('122', 'http://wx.qlogo.cn/mmopen/eyfHacunr4IaOE4UGsD8akF7GNFs3YIIkVGZzlFLLEA1eukmgqFbl0Uw0IUIY4wVPJicDgNyjqhLjH5hXZQoWwUvuGG6KCibE9/0', '朱柳哈哈', '', 'ocVDd1PfevTyJ3jZgNHZryx_gnEk', 'oKA9kwD26qqakYz_lK8U5FDSslQI', '1', '', '0', '2', '2017-10-20 17:16:01', '2017-10-20 17:16:01');
INSERT INTO `user` VALUES ('123', '', '17768572693', 'oH5wb0fCZ9LlcRU3_Szf2K748A6U', 'ocVDd1KBrdZjpCXJ3nh7FJOyKBY8', 'oKA9kwOxn8M5F4ZLup505veNpRsQ', '1', '', '0', '2', '2017-10-20 17:16:01', '2017-11-03 09:38:17');
INSERT INTO `user` VALUES ('124', 'http://wx.qlogo.cn/mmopen/eyfHacunr4JPzKlRwF4tl6XV7FeQfKjZ5SBviacz0GIFfxLhEl6dGG6RtjJyQqvnJJDEsmdLScN5HtlepDZ5pIfAxpa73Eeiap/0', 'forgot', '', 'ocVDd1D-t8yDkAq5hMrqza62rLYg', 'oKA9kwIWn0eHjkMh-Xp6vGM_Fehg', '1', '', '0', '2', '2017-10-20 17:16:02', '2017-10-20 17:16:02');
INSERT INTO `user` VALUES ('125', 'http://wx.qlogo.cn/mmopen/gHj3DVcFxSzFicdmZKkWSxWyOmjptShAUiagzEnDUibtanYP9tRU5u6POdXL0QH5kaLvicPff5YHCtAtP0stG7hnJeHDQo7XEkwq/0', '如同草木', '', 'ocVDd1P1PRXVYyaBx76sHCdRHOUg', 'oKA9kwPqTpymDx4C6vWtOmWSNc9g', '1', '', '0', '2', '2017-10-20 17:16:02', '2017-10-20 17:16:02');
INSERT INTO `user` VALUES ('126', 'http://wx.qlogo.cn/mmopen/eyfHacunr4IaOE4UGsD8anv8cjjAXez1MN6E3S94r3tmascs5whs9VNUYclpAVbAtGhGdcaeia1w0ib0FZerwKX6r1kibXGoohu/0', '赵建飞', '', 'ocVDd1HussOPFGjRRACbDAwFS510', 'oKA9kwGlYQqlLBTwpiq04b7fdmgk', '1', '', '0', '1', '2017-10-20 17:16:02', '2017-10-20 17:16:02');
INSERT INTO `user` VALUES ('127', 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM7RVWz9JNFEZ6ibafVr6ggOr4aR6ZHxDCyaOw5oP3HuZ1CnSXZPXibmmN6Ypfdd8cYSoSxfZwv7mtRrPQencyT3ptoZOghn3pXko/0', '王小欠儿', '', 'ocVDd1Ob2gc4YHYo4eTJ4VWIw6J0', 'oKA9kwN7PN2ru5QviB3d4uBSWiLo', '1', '', '0', '2', '2017-10-20 17:16:03', '2017-10-20 17:16:03');
INSERT INTO `user` VALUES ('128', 'http://wx.qlogo.cn/mmopen/PiajxSqBRaEIMpKURmLBQajrKU4IctLFSaJqNDBhNYlbUoMH6OFE7ChGTcia6e1CvGC4MgEmwvl5grxVnL1CXcwQ/0', 'amy', '', 'ocVDd1PuhOtBdQaZmDYFnRCc9phA', 'oKA9kwG0kvyIy623wYbblOYYake4', '1', '', '0', '2', '2017-10-20 17:16:03', '2017-10-20 17:16:03');
INSERT INTO `user` VALUES ('140', 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erJzQ3tL566pXHMs6mB3pM3L2CAtsibicaL3OLRpzaia2XoksdHZciaCxQTdqO88ZayibtoF7Xz4bcE09Q/0', '????小贝贝菜菜子????', 'oH5wb0dl0aP6t9DR7IckU6EdiRVI', 'ocVDd1LwgfjMzi5P77GOP0tFz5qo', 'oKA9kwB5MW9e1w1h-F2qA1IdLwBQ', '2', '', '0', '2', '2017-10-30 15:20:48', '2017-11-07 12:08:27');
INSERT INTO `user` VALUES ('141', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLlfUwlCtFiatMWtsXvPicnxqkueBGpeos0JzficrQX6lxCribgtfDUic9huJuqDMZ42U9h2YXPArXrlAQ/0', 'lisa', 'oH5wb0VUPfzvysU4jB-YOxM9T0mw', 'ocVDd1FCsYrdNnBnuM6NWP4qKLiE', 'oKA9kwOrkgK6S5p853trHMJ5B0UM', '2', '', '0', '2', '2017-10-30 15:51:34', '2017-10-30 15:51:46');
INSERT INTO `user` VALUES ('142', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKqB8lI9Y2ZKus25bEuBYc7RuoZPZkTYsn48F0Us7cERlKOIs1eibdNy3dUgKoRibJyIfbgdjtQdobA/0', '音曼音乐课堂', 'oH5wb0aldxYt6jDGTE5ZTDjSglPk', 'ocVDd1KtUGjaZQQ90M6wMZk5wk4s', 'oKA9kwN6i5-1vsnBdhA8thFfmq3Y', '2', '', '0', '2', '2017-10-30 17:31:35', '2017-11-06 11:13:03');
INSERT INTO `user` VALUES ('143', 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoaQBcYbuwV1bN9I6zOBEphnC9MGeJRf28VroQ1ldp2ye0yjiaPyFwMXp2nY6KmjicsUXLEOKp95Mmw/0', '欢乐喜剧人', 'oH5wb0Y_2FrmijKWINOjuGP8ZH9E', null, null, '1', '', '0', '0', '2017-11-01 12:26:41', '2017-11-01 12:26:45');
INSERT INTO `user` VALUES ('144', 'http://wx.qlogo.cn/mmopen/gwhELYibibFdTwtsibd1uQo5U4TA8gk5XH39N2Whl76Cg7iag3Om05mIcWLb4fvLRKEqdvMODYDQ4p6TXOt9GKxbfg/0', 'ฅ 蛛络 ฅ', '', 'ocVDd1Lis5N63nqMO2t5fXDqyqNc', 'oKA9kwCAQE6V4bAzz4pkxahoYxT0', '1', '', '0', '1', '2017-11-01 15:15:11', '2017-11-01 15:15:11');
INSERT INTO `user` VALUES ('145', 'http://wx.qlogo.cn/mmopen/ajNVdqHZLLCMnhlV3F2FlicX2BFOQOL8oknWsudYfSZKLmKSr7wFnyZqRSf1MEC2gBPj7iaJMPeqXzzMQ55yYUlQ/0', '虎妈', '', 'ocVDd1FXok6-x0DR17AMCCLRCk4c', 'oKA9kwLMZkVeU6k45-d2pnQ0slsg', '1', '', '0', '2', '2017-11-02 14:44:16', '2017-11-02 14:44:16');
INSERT INTO `user` VALUES ('146', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLrwwwJUEO7NODr7UQyHUmb3bJB9X1ibONAww6dYTniauf45T3XhPiarpxbLueFHZsKrd0aICG1ApfNw/0', '西西里', 'oH5wb0aC1URSMnQ4h1EvcGhmRHQM', 'ocVDd1KDGxTeXZMZIh793SE0Hdpw', 'oKA9kwHPDwWYu1REgv99TkDqm76c', '1', '', '0', '2', '2017-11-02 14:44:37', '2017-11-09 15:12:26');
INSERT INTO `user` VALUES ('147', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKvfZKP9dcFiavmhHrVfvAvP9ey4pt0uYa4ltaALbE1RCyjbqW2DJUdjFZyiaEgj0GhibREzjw9szibOw/0', 'Mike', 'oH5wb0TQCj_3OjHmmdDalvEXNIyg', 'ocVDd1G4coZOSjmExX2vcQHAvur8', 'oKA9kwCTOwsr57g8d7S2kFaot-Ew', '1', '', '0', '1', '2017-11-02 14:44:53', '2017-11-02 14:45:01');
INSERT INTO `user` VALUES ('148', 'http://wx.qlogo.cn/mmopen/gHj3DVcFxSwLDEy6uNw5BT2YbBnX0D2kYsxgjJeb8IFffMvMZxr5UxJIUB8bR6ia0tFgApQmMkTkFKDcckKq7DT9fiakD62eUh/0', 'Chris', '', 'ocVDd1KmueZuzyQqlmXGB90Sl534', 'oKA9kwEvkE5MDRCZ0GUCsB9dqbrE', '1', '', '0', '2', '2017-11-02 14:44:54', '2017-11-02 14:44:54');
INSERT INTO `user` VALUES ('149', 'http://wx.qlogo.cn/mmopen/eyfHacunr4IaOE4UGsD8amo68ghY0bn0uX7syUfMJqzrwp7DrnwtibibgSWCDa22SPELHT7mlaeXbljykAyBvvoChJXEVIm2j8/0', '黄芳', '', 'ocVDd1KXc2aUsqgaExHhucI5Q1Qk', 'oKA9kwC32bl_NwJe15B1Pk-LPu8w', '1', '', '0', '2', '2017-11-02 14:45:10', '2017-11-02 14:45:10');
INSERT INTO `user` VALUES ('150', 'http://wx.qlogo.cn/mmopen/gHj3DVcFxSwLDEy6uNw5BT3ia2iaSZIxGugbdFeTFGbYYXIm86PBCcniaTUMOua6sj7VZqicwJJISmhZcwiajSUEcPIVVtVfCV0RT/0', '太姬', '', 'ocVDd1AjCUKukZ-0jw9K07va7Eoo', 'oKA9kwFZHldfoON7ySl6iQGfEfoA', '1', '', '0', '2', '2017-11-02 14:46:41', '2017-11-02 14:46:41');
INSERT INTO `user` VALUES ('151', 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epdz0JfT14w8fibq6qXzFNWLALoKQrpv65wkxjUdPrsyIgib3CCcgtzPmk77qiaPMekTv82HCdme9RcA/0', 'Yan~~', 'oH5wb0fwFiEknStVSFPEmMBQWz4I', 'ocVDd1IpvEk5Iy4Rn3AoBQHKPqQo', 'oKA9kwOxWzC8wcwsShOOmAzNLL8Y', '1', '', '0', '2', '2017-11-02 14:46:46', '2017-11-02 14:46:58');
INSERT INTO `user` VALUES ('152', 'http://wx.qlogo.cn/mmopen/gHj3DVcFxSwLDEy6uNw5BcwlB6cSbDK3oE7ibluIk3yHrEpl5gibicLUicYHCWecH2TN1at6m73ItrBeLwpibdH3W3JRGIdtJ8fJ3/0', '高薇', '', 'ocVDd1GJtI8UrOgAYMWznQqHTC2s', 'oKA9kwE_q4edK3RizDRApQWfiLlI', '1', '', '0', '2', '2017-11-02 14:48:08', '2017-11-02 14:48:08');
INSERT INTO `user` VALUES ('153', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJpzjGt9jD6OOHMzRXecxXbnrdSBz5luxZs5gwmzcfBdiaUZMeZF5ibaRs9Ozy2eP9SaHZjUFDPUdsA/0', '林娅', 'oH5wb0fhBBxlQZOznGhZvQDp71Kc', 'ocVDd1BBTxb18Nebw6vbJ9i31gKE', 'oKA9kwLyM7L9YsfP_z1SB9lgHeTo', '1', '', '0', '2', '2017-11-02 14:48:52', '2017-11-03 08:16:57');
INSERT INTO `user` VALUES ('154', 'http://wx.qlogo.cn/mmopen/VDXGVfUwepQAiaiaP8Fg6B2wULnDYLH81h2qGbgETGHxhvl8uhqGOpUYTs2HrjEbDUbd0LQJv6EwFibD5x3kg7HXTVJrZUe39Dp/0', 'tinnacao', '', 'ocVDd1CFR_l0RA_Mvt2BCY5ZiCDo', 'oKA9kwCxhbmbNNnnmsRkkb0zynTI', '1', '', '0', '2', '2017-11-02 14:53:49', '2017-11-02 14:53:49');
INSERT INTO `user` VALUES ('155', 'https://wx.qlogo.cn/mmopen/vi_32/SrHqe2zcBvwZ0WfMkxbaE3PTQyVNnnUYkXkQRWx7fD1pNlLalTCicMib7T46SJ0icmuCOXWamU5358JWhF0UwyYPQ/0', '姚烺', 'oH5wb0a9fNnT3tgTVCy4I2igPfLo', 'ocVDd1NuFruJSmscQTe4v37VGF-Q', 'oKA9kwD7b-HO4Pp3SqSo0hlfDbTg', '1', '', '0', '1', '2017-11-02 15:52:42', '2017-11-02 15:53:28');
INSERT INTO `user` VALUES ('156', 'http://wx.qlogo.cn/mmopen/eyfHacunr4IaOE4UGsD8angPR2SYVVq7bibg0A2Qb47zvhBOPmXjPPXKmaxABH3myat8lZmkrkb2RDOaibB7VZLacM6QQ7hnbia/0', '张成文', '', 'ocVDd1MiwX3rA07D4K6rV_LVzi1Q', 'oKA9kwPGGBNiuGXgou11PLZiYPUk', '1', '', '0', '1', '2017-11-02 15:58:52', '2017-11-02 15:58:52');
INSERT INTO `user` VALUES ('157', 'https://wx.qlogo.cn/mmopen/vi_32/FflZ2nuJwJyzicNoib6McE0ZyhHHricqCFrao960Abnb9Ky5lyYjh4QUfcaguhJtcmibQQSYy9ymhZHoibBjMOPQyrg/0', '老虎没吃到吃掉小黑猪', 'oH5wb0bgSBoA3RseIISTHXQo4hyA', 'ocVDd1N4ylHeX77jf4SThE0p9CkA', 'oKA9kwCTY8SC4GONS44X2MqNOIUU', '2', '', '0', '1', '2017-11-02 16:01:16', '2017-11-08 10:04:38');
INSERT INTO `user` VALUES ('158', 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoPzJgWZ6js6IaLqGPEgm6sUmdrMe4uRs62fsVXAFk6bP3GibUevzT9x2ibHCd35SPqBMXqos3TBqww/0', '吴婷', 'oH5wb0T2ff_G2CIGTB-zNqAzqsBM', 'ocVDd1MCIWX7cvmFR4_Cyj0wbzWk', 'oKA9kwK8tqUbQnErOBOy42peIeVg', '2', '', '0', '2', '2017-11-02 16:01:35', '2017-11-02 16:01:43');
INSERT INTO `user` VALUES ('159', 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqvaPTSYCtlXXmic2zFLYWEESN1rsM8ZqMchWcwLKg4TX0SqNb6JEh1aJkOKtl0XMFVC7GpJwoPeRQ/0', '明宣????', 'oH5wb0bUP9h7Z7P6n8x8XC-FHQVQ', 'ocVDd1N4qI4LqIteqSu1mWe6L_Yw', 'oKA9kwO4EhPR3l6rjWy8MX8sFZmU', '1', '', '0', '0', '2017-11-02 16:07:28', '2017-11-02 16:13:27');
INSERT INTO `user` VALUES ('160', 'http://wx.qlogo.cn/mmopen/gHj3DVcFxSwLDEy6uNw5BcwIGeHvqZEgMttEWxQ6ydsWYl6xeJIqLiaicPacX46KaRiaGcOUlZ5SflVQcqR9CIKV2IpmF0ciaibLL/0', 'Lynn Li', '', 'ocVDd1IGGPrcq6FAgFbcNG5FRYw4', 'oKA9kwDatdFMxOKtNv7UZVFb5Oao', '1', '', '0', '2', '2017-11-02 16:10:42', '2017-11-02 16:10:42');
INSERT INTO `user` VALUES ('161', 'http://wx.qlogo.cn/mmopen/gHj3DVcFxSwLDEy6uNw5BdIR2lSjTTb7CV42HialHh2dFzxaehqXmQIJzXGDCXwalTNicDuIO4tLbicG6ic5eK1yqiclzPUNP2TbY/0', 'hpf', 'oH5wb0Yx-GrC1A5aYnUIyEvK8LQU', 'ocVDd1E_OAJx5t2nvFqX1mbYlfYQ', 'oKA9kwJt-T374UDy8s8t3eZQURLE', '1', '', '0', '2', '2017-11-02 16:16:17', '2017-11-02 16:16:17');
INSERT INTO `user` VALUES ('162', '', 'rdgztest_OTWXZU', 'oH5wb0cFN1TbXDZ7oDvxSLThNqiQ', null, null, '1', '', '0', '0', '2017-11-02 20:50:32', '2017-11-02 20:50:40');
INSERT INTO `user` VALUES ('163', '', '', 'oH5wb0ZNiYqYE5Kdxc8L46A78EQs', 'ocVDd1HOnAx0__CLT58uoVc1g-H8', 'oKA9kwH1Dd-MacYaBROq-_RE8J0A', '1', '', '0', '0', '2017-11-02 22:25:11', '2017-11-02 22:25:11');
INSERT INTO `user` VALUES ('164', 'http://wx.qlogo.cn/mmopen/YeexA5fU3YwP79w67Tm27eGoPmicYRLIia2eBNy5Y6XUHhZ8LGrQuj8GS2ibvH0klNPdcNRzCibZSaNTs8yTK7OHiaIOJmkdtScNT/0', '松', '', 'ocVDd1IvAIKEzpciqgaVnj0or2dE', 'oKA9kwOLp6mmvIP7Hy7Ja1koXoFc', '2', '', '0', '2', '2017-11-03 09:11:07', '2017-11-03 09:11:07');
INSERT INTO `user` VALUES ('165', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIT7dFBicuo9Gic1t6gicR2y5ZqGk6ta7STroPictWsCorJNoCejZoZ2mZibclaicoY5Cu3pIfxc5NWloqg/0', 'Miss-zhao', 'oH5wb0Uf26oR28npilSd9oahXsYo', 'ocVDd1GXaBltqCBitMcClximcY7g', 'oKA9kwO5-R3lEazM639OJuhHmT_8', '1', '', '0', '2', '2017-11-03 09:11:09', '2017-11-07 12:40:43');
INSERT INTO `user` VALUES ('166', 'https://wx.qlogo.cn/mmopen/vi_32/XJZLhs8RCGZ751dSMicBIR9mZfSqBUpFAhZQ2PODicEQic5KrVbu4XCD2q9Avo229lWZr5ILjto8zC7V7ppbDeiciaQ/0', 'Rainbow', 'oH5wb0TtCmub7GG6VVOMBd7-fIKw', 'ocVDd1JjUHl8emNlOpqDgUQP0odc', 'oKA9kwGlC-6OYK3jPHQPUPvxAV0Q', '2', '', '0', '2', '2017-11-03 09:11:10', '2017-11-12 17:04:33');
INSERT INTO `user` VALUES ('167', 'http://wx.qlogo.cn/mmopen/gwhELYibibFdRxZqMp60WZeSe150JfXOgZiaaxseznK4NozqLicwQFxPjEjR2WbcmcFhibcxeoJOSKoxPrzqmZpicvgdqyPeBD1KTR/0', '年月', '', 'ocVDd1HBVmbRa-oqZOwceGCF2nis', 'oKA9kwEPyl1dyk-AnxfFSdYEurK4', '2', '', '0', '2', '2017-11-03 09:11:11', '2017-11-03 09:11:11');
INSERT INTO `user` VALUES ('168', 'http://wx.qlogo.cn/mmopen/gwhELYibibFdTrx1elEiaHhPyNY45VO8ya66Yqw4Uic4icum4Xt1pvPGqaEsudFOiajCiaT7zd1fia45olS6YFEx6C8yrHo4lSicVaw55/0', 'Angela shen', '', 'ocVDd1FPWXiK2hPi95XqoIP5N0EE', 'oKA9kwBj3v55KFiWRSz7JICRxLOg', '1', '', '0', '2', '2017-11-03 09:11:12', '2017-11-03 09:11:12');
INSERT INTO `user` VALUES ('169', 'http://wx.qlogo.cn/mmopen/gHj3DVcFxSwFdOOgBWicWuovB56HWVC4lZotWZHBIdcOdPSGs5icaJJMeQn7DCUic5nydkTwJwWsclJJMv2hib7t8eJBBOiaN6809/0', '吴晓艇', '', 'ocVDd1JF9gEq2bXYLcnmIps3Rxnw', 'oKA9kwFLS1pHPvqSbRnUp0mGfIio', '2', '', '0', '2', '2017-11-03 11:17:57', '2017-11-03 11:17:57');
INSERT INTO `user` VALUES ('170', '', 'rdgztest_BWHMAZ', 'oH5wb0YyMUnrvGBoEF2dHTsgbRqI', null, null, '1', '', '0', '0', '2017-11-03 11:34:52', '2017-11-03 11:35:14');
INSERT INTO `user` VALUES ('171', '', 'rdgztest_RXKDRJ', 'oH5wb0SJA4gwtYn2gMM1PjzkU6S8', null, null, '1', '', '0', '0', '2017-11-03 14:49:33', '2017-11-03 14:49:41');
INSERT INTO `user` VALUES ('172', 'http://wx.qlogo.cn/mmopen/eyfHacunr4Iv8j4fFc2AibyLT9t6ZeCiaqWV4QWqNUP7Bkllvg6lKEgkJSRlRwT2sOYWmH7w5NZJkaibibwceM7vtg/0', 'Cherie', '', 'ocVDd1PHkOF4Prge4N-3Xbm0VNLQ', 'oKA9kwOpC-1J_JnnU0uH1DBrfxaE', '1', '', '0', '0', '2017-11-05 13:38:49', '2017-11-05 13:38:49');
INSERT INTO `user` VALUES ('173', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJPW0o5H2Qm524uWDDORf1aUV2WNmicG3OM70bW7MXGEng2tba2cbN65OeladrRLext9UIcTnunr6g/0', '盛婷', 'oH5wb0dDSgqyAgmEqwj-RkHUrtdY', 'ocVDd1BDelUtnNgj3F9ulwlGU12Y', 'oKA9kwJkklW9f9NzUJ0RDYXKllRY', '1', '', '0', '2', '2017-11-05 13:38:52', '2017-11-05 13:39:00');
INSERT INTO `user` VALUES ('174', 'https://wx.qlogo.cn/mmopen/vi_32/7fHOf8tpK3guK7898ciatQsyWds9Libibgg3D5egIk7MX4uqkauUDfqAyd9zSMTDFsjIthQECDwRP8JIaDXZJK35w/0', '周和能', 'oH5wb0RUgQ_ywZ2VDBegWIe0odng', null, null, '1', '', '0', '1', '2017-11-06 03:02:44', '2017-11-06 03:02:47');
INSERT INTO `user` VALUES ('175', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLJ8iaF8CHW7K0Dt8qoVDiaojibq2RZ3qqeBr4nHUqaRxeQZ6VAjZLDDOe8CecVGHYANa8bsRnZhjG2g/0', '俞然踏冰雪', 'oH5wb0Znpp0OZLeZLnR9EVAqAKU4', 'ocVDd1Ph0RZ-HNVYs8WvO_2icpjQ', 'oKA9kwErjFAfIO3vPSKMFSXMzW2g', '1', '', '0', '1', '2017-11-07 12:21:12', '2017-11-07 12:21:16');
INSERT INTO `user` VALUES ('176', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLjWS64XiaGzj70NBia7jpfLuOd3IbG76xbPBYvJIZ17Ry0ngjZKCoefQaPyXjiaD3ibQYEAreQMMRX2A/0', '徐晓君', 'oH5wb0TnCq8YVbXylMnkad9vhmzc', 'ocVDd1Hdw-pUc4-Gvi-aiu4Mn_bQ', 'oKA9kwGlMY6WKHul2u_BuKRkgtCI', '1', '', '0', '2', '2017-11-07 17:19:03', '2017-11-07 17:19:07');
INSERT INTO `user` VALUES ('177', 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epwib4gNnCEKXAYReRJIiblUib2gP1MQ1OOBviardLjx12HmaE00bC5OicFAI0EgPTEeC1s8CoC5an8hicA/0', '智贝星创始人', 'oH5wb0QE5Bx8Ui3NNomoELd3NnRI', null, null, '1', '', '0', '1', '2017-11-08 18:31:55', '2017-11-09 08:47:27');
INSERT INTO `user` VALUES ('178', '', '', 'oH5wb0QE5Bx8Ui3NNomoELd3NnRI', null, null, '1', '', '0', '0', '2017-11-09 08:47:27', '2017-11-09 08:47:27');
INSERT INTO `user` VALUES ('179', 'https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEIEYf6kvj9f0KX1PCzMun4vcwLu5co6YBUVpD35hZa0CVQsjXysCfodyC0VplicVgTFibhrfZIO6I4A/0', '吴亮', 'oH5wb0aHslw58Gz7TmJWWXDgpRtw', 'ocVDd1OgVGv_uK9x1NR9n7dcy5Zs', 'oKA9kwNLUVgcJj-zNsMOB4nS8beo', '1', '', '0', '1', '2017-11-09 11:08:14', '2017-11-09 11:08:21');
INSERT INTO `user` VALUES ('180', 'https://wx.qlogo.cn/mmopen/vi_32/QOziautCDECAab7ba0DbECqiawQkRF3eLUNvJD5ibqazwKmOx855QzJTuBXfIDkD0Dm0jpgs3BVnRyhYbeFCz1BtQ/0', '山水之间', 'oH5wb0bK6vF2GcljfyIWX239I06k', null, null, '1', '', '0', '0', '2017-11-10 12:14:25', '2017-11-10 12:14:27');
INSERT INTO `user` VALUES ('181', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIenBesolAerWoQmWQWJyQmEEMGfZkupn6iaCgd0EaqUonHBSLx9fhudBnhvSlia1sRInViaEujacfbw/0', '✨carol????琼????', 'oH5wb0crYnYXQnJkP2mYKU8msIME', 'ocVDd1H4cUiy2qhnMVT6kJS2Mr_g', 'oKA9kwKUP4wEwbYWI6vtgPVWgVH0', '1', '', '0', '2', '2017-11-11 18:59:45', '2017-11-11 18:59:51');
INSERT INTO `user` VALUES ('182', 'http://wx.qlogo.cn/mmopen/fYMW6RD1vRd9udVFFCXku3ibic5sYbk88uU9hpeZgWiaoTbh419IkbQeTD68as9VPsstvAbZ47tGUSibOPDZicvh7O2xQqTR3OK1E/0', '春天暖', '', 'ocVDd1AEtQCcPG5Fsl8SikGa5hBQ', 'oKA9kwEmnmiyxOmdsJ1PHdLaC_nA', '1', '', '0', '1', '2017-11-13 17:54:45', '2017-11-13 17:54:45');

-- ----------------------------
-- Table structure for voiceintroduction
-- ----------------------------
DROP TABLE IF EXISTS `voiceintroduction`;
CREATE TABLE `voiceintroduction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of voiceintroduction
-- ----------------------------
INSERT INTO `voiceintroduction` VALUES ('1', '<div><div>音曼音乐课堂，成立于2013年。一个汇集国内外知名音乐学府毕业的优秀学士、硕士生的高品质教师团队，国内较早倡导，研究英皇考级的音乐工作室。坚持“兴趣引导学习，专业体会快乐”的教育理念，致力于以钢琴为主的音乐教育。</div><div>音曼音乐课堂目前设有三门音乐课程：钢琴课、音乐素养课、声乐课。每门课程以有趣并且专业的形式使孩子得到“有用”且“有兴趣”的独特技能。并通过课程搭配，使孩子能够得到全面的音乐学习，脱离枯燥的“乐谱复读机”，让孩子真正“享受”音乐、爱上音乐。</div><div>音曼音乐课堂采用课堂＋音乐会的双重模式，让音乐学习不仅仅局限于课堂，更需要在氛围，展示中成长，热爱。“音乐沙龙、音乐会、比赛、考级等多样形式的专业指导，为孩子建立学习目标，同时提供各种展示机会。从了解、学习、提升、展示为您带来全面的学习服务。</div><div>选择音曼，让孩子爱上 “真正的”音乐。</div></div>');
