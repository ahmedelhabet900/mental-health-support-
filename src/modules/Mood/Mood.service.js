import Mood from "../../DB/models/mood.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getToday = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" });

const getResult = (score) => {
  if (score <= 3) return "needs_care";
  if (score <= 6) return "mixed";
  return "supported";
};

const getMoodMessage = (result) => {
  const messages = {
    supported: {
      title: "ملاحظتك لنفسك خطوة مهمة",
      body: "إجاباتك تشير إلى أن لديك مساحات داعمة بالفعل. استمر في ملاحظة شعورك، وحافظ على ما يريحك.",
      step: "خصص دقيقتين اليوم لكتابة ما شعرت به، أو جرّب تمرين تنفس قصير.",
      note: "هذه خلاصة تعليمية مبنية على إجاباتك، وليست نتيجة طبية.",
    },
    mixed: {
      title: "ملاحظتك لنفسك خطوة مهمة",
      body: "إجاباتك تشير إلى أن هناك مساحات داعمة بالفعل، وأخرى قد تحتاج منك اهتماماً ألطف. لا تحوّل النتيجة إلى حكم، اختر خطوة واحدة قابلة للتجربة.",
      step: "خصص دقيقتين اليوم لكتابة ما تشعر به وما تحتاجه، أو جرّب تمرين تنفس قصير.",
      note: "هذه خلاصة تعليمية مبنية على إجاباتك، وليست نتيجة طبية.",
    },
    needs_care: {
      title: "ملاحظتك لنفسك خطوة مهمة",
      body: "إجاباتك تشير إلى أن الأيام الأخيرة ربما كانت ثقيلة قليلاً، وهذا يحدث مع كثيرين. لا تحمّل نفسك أكثر مما تحتمل، وخذ خطوة صغيرة تريحك.",
      step: "جرّب تمرين تنفس قصير، وفكّر في الحديث مع شخص تثق به أو مع مرشد مختص إذا استمر هذا الشعور.",
      note: "هذه خلاصة تعليمية مبنية على إجاباتك، وليست نتيجة طبية.",
    },
  };

  return messages[result];
};

export const submitMood = asyncHandler(async (req, res, next) => {
  const { answers } = req.body;
  const score = answers.reduce((sum, value) => sum + value, 0);

  try {
    const mood = await Mood.create({
      userId: req.user._id,
      day: getToday(),
      answers,
      score,
      result: getResult(score),
    });

    return res.status(201).json({
      success: true,
      message: "Mood check saved",
      mood,
      resultMessage: getMoodMessage(mood.result),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "You already checked in today" });
    }
    throw error;
  }
});

export const getTodayMood = asyncHandler(async (req, res, next) => {
  const mood = await Mood.findOne({ userId: req.user._id, day: getToday() });

  return res.status(200).json({
    success: true,
    mood,
    resultMessage: mood ? getMoodMessage(mood.result) : null,
  });
});

export const getMoodHistory = asyncHandler(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 50);

  const [moods, total] = await Promise.all([
    Mood.find({ userId: req.user._id })
      .sort({ day: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("day answers score result"),
    Mood.countDocuments({ userId: req.user._id }),
  ]);

  return res.status(200).json({ success: true, page, total, moods });
});