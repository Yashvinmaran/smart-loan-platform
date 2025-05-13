package com.microloan.service;

import com.microloan.model.Document;
import com.microloan.model.User;
import com.microloan.repository.DocumentRepository;
import com.microloan.repository.UserRepository;
import com.microloan.util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileUploadUtil fileUploadUtil;

    public Document saveDocuments(Long userId, MultipartFile aadharFile, MultipartFile panFile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        String aadharPath = fileUploadUtil.saveFile(aadharFile);
        String panPath = fileUploadUtil.saveFile(panFile);

        Document document = new Document();
        document.setUser(user);
        document.setAadharFilePath(aadharPath);
        document.setPanFilePath(panPath);

        return documentRepository.save(document);
    }
}