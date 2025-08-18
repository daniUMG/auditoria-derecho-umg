<template>
    <div class="pdf-container"></div>
</template>

<script>
import PSPDFKit from 'pspdfkit';
import { onMounted } from 'vue';

export default {
    name: 'PSPDFKit',
    props: {
        pdfFile: {
            type: String,
            required: true
        }
    },
    mounted() {
        this.loadPSPDFKit().then((instance) => {
            this.$emit('loaded', instance)
        })
    },
    watch(val) {
        if(val) {
            this.loadPSPDFKit()
        }
    },
    methods: {
        async loadPSPDFKit() {
            PSPDFKit.unload('.pdf-container')
            return PSPDFKit.load({
                document: this.pdfFile,
                container: '.pdf-container'
            })
        }
    },
    beforeUnmount() {
        PSPDFKit.unload('.pdf-container')
    },
}
</script>

<style>
.pdf-container {
    height: 100vh;
}
</style>