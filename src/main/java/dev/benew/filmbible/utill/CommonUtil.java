package dev.benew.filmbible.utill;

import dev.benew.filmbible.domain.common.PageDto;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;

import org.apache.tomcat.util.codec.binary.Base64;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.TextNode;

import java.nio.charset.StandardCharsets;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;
import java.util.Objects;

@Slf4j
public class CommonUtil {
    public static String base64Encode(String message) {
        return Base64.encodeBase64URLSafeString(message.getBytes(StandardCharsets.UTF_8));
    }

    public static String base64Decode(String base64Message) {
        try {
            return new String(Base64.decodeBase64URLSafe(base64Message), StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.warn("base64Decode - error");
            /*e.printStackTrace();*/
            return null;
        }
    }

    // 숫자 3번째마다 , 찍어줌
    public static String addComma(Integer value) {
        if (value == null)
            return "";

        DecimalFormat formatter = new DecimalFormat("#,###");
        return formatter.format(value);
    }
    public static String addComma(Long value) {
        if (value == null)
            return "";

        DecimalFormat formatter = new DecimalFormat("#,###");
        return formatter.format(value);
    }

    public static Boolean equals(Object obj1, Object obj2) {
        return Objects.equals(obj1, obj2);
    }

    // pagination에서 index 표시
    public static Integer index(Integer currentIndex, PageDto pageDto) {
        Integer count = pageDto.getCount();
        Integer currentPage = pageDto.getCurrent_page();
        Integer size = pageDto.getSize();

        return (count - currentIndex) - (currentPage > 1 ? currentPage - 1 : 0) * size;
    }
    public static Integer forwardIndex(Integer currentIndex, PageDto pageDto) {
        Integer currentPage = pageDto.getCurrent_page();
        Integer size = pageDto.getSize();

        return (currentPage - 1) * size + currentIndex + 1;
    }

    // null값일 경우 대체 텍스트 사용
    public static String coalesce(String str, String defaultValue) {
        if (str == null || str.isEmpty())
            return defaultValue;
        return str;
    }

    // 휴대폰 번호 형식으로 변환
    public static String validatePhone(String phone, String defaultValue) {
        if (phone != null && !phone.isEmpty()) {
            if (phone.contains("~"))
                phone = phone.split("~")[0];
            phone = phone.replaceAll("[^0-9]", "");
            String regEx = "(\\d{3})(\\d{3,4})(\\d{4})";
            try {
                return phone.replaceAll(regEx, "$1-$2-$3");
            } catch (Exception ignore) {}
            return phone;
        }

        if (defaultValue != null)
            return defaultValue;
        else
            return "";
    }

    // 사업자 번호 형식으로 변환
    public static String validateBusiness(String businessNum) {
        if (businessNum == null || businessNum.isEmpty())
            return "";
        businessNum = businessNum.replaceAll("[^0-9]", "");
        String regEx = "(\\d{3})(\\d{2})(\\d{4,6})";
        try {
            return businessNum.replaceAll(regEx, "$1-$2-$3");
        } catch (Exception ignore) {}

        return businessNum;
    }

    // 글자 **처리하기
    public static String maskString(String str) {
        if (Strings.isEmpty(str))
            return "***";

        // 이메일일 경우
        if (str.contains("@"))
            str = str.split("@")[0];
        else if (str.contains("kakao:"))
            str = str.split("kakao:")[1];

        int length = str.length();

        if (length == 2) {
            // 문자열이 2글자이면 마지막 글자를 *로 변환
            return str.charAt(0) + "*";
        } else if (length == 3) {
            // 문자열이 3글자이면 가운데 글자를 *로 변환
            return str.charAt(0) + "*" + str.charAt(2);
        } else if (length >= 4) {
            // 문자열이 4글자 이상이면 첫 글자와 마지막 글자를 제외하고 *로 변환
            StringBuilder masked = new StringBuilder();
            masked.append(str.charAt(0));
            for (int i = 1; i < length - 1; i++) {
                masked.append("*");
            }
            masked.append(str.charAt(length - 1));
            return masked.toString();
        } else {
            // 1글자 이하일 경우
            return "***";
        }
    }

    // html <- text로 변경
    public static String htmlToText(String html) {
        if (html == null)
            return "";
        return html.replaceAll("<br>", "\n").replaceAll("&nbsp;", " ");
    }
    // text <- html로 변경
    public static String textToHtml(String text) {
        if (text == null)
            return "";
        return text.replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;");
    }

    public static String htmlToCleanText(String html) {
        if (html == null)
            return "";
        return Jsoup.parse(html).wholeText();
    }

    public static String textToHtmlByJsoup(String text) {
        if (text == null)
            return "";
        Document doc = Jsoup.parseBodyFragment(text);
        for (TextNode node : doc.body().textNodes()) {
            String content = node.getWholeText()
                    .replace(" ", "&nbsp;")
                    .replace("\n", "<br>");
            node.text("");
            node.before(content);
        }

        return doc.body().html();
    }

    // double 변수 지정한 자리수까지 반올림 해서 반환
    public static Double roundDouble(
            Double doubleValue,
            Integer decimalPlace // 소수점 자리수 ex) 1 <- 0.1 첫번째자리
    ) {
        if (doubleValue == null || decimalPlace == null)
            return null;

        double scale = Math.pow(10, decimalPlace);

        return Math.round(doubleValue * scale) / scale;
    }

    // integer format 변경
    public static String integerFormat(
            Integer integer,
            String pattern // "00" <- 2자리, "000" <- 3자리
    ) {
        if (integer == null || pattern == null) {
            return null;
        }

        DecimalFormatSymbols symbols = DecimalFormatSymbols.getInstance(Locale.US);
        DecimalFormat decimalFormat = new DecimalFormat(pattern, symbols);
        decimalFormat.setGroupingUsed(false); // 천 단위 구분자 사용 안 함

        return decimalFormat.format(integer);
    }
}
